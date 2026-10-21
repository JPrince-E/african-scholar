const { ScholarProfile, User } = require('../models');
const { Op } = require('sequelize');

const formatProfile = (profile) => {
  if (!profile) return null;
  const p = profile.toJSON ? profile.toJSON() : { ...profile };
  if (typeof p.past_positions === 'string') {
    try { p.past_positions = JSON.parse(p.past_positions); } catch (_) { p.past_positions = []; }
  }
  if (typeof p.present_positions === 'string') {
    try { p.present_positions = JSON.parse(p.present_positions); } catch (_) { p.present_positions = []; }
  }
  if (typeof p.community_impact_activities === 'string') {
    try { p.community_impact_activities = JSON.parse(p.community_impact_activities); } catch (_) { p.community_impact_activities = []; }
  }

  // 1-Year Free Trial Tracking (Starts at registration, never resets on profile update)
  const startDate = p.trial_started_at ? new Date(p.trial_started_at) : (p.created_at ? new Date(p.created_at) : new Date());
  const expiryDate = p.trial_expires_at ? new Date(p.trial_expires_at) : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const totalDurationMs = Math.max(1, expiryDate.getTime() - startDate.getTime());
  const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
  const remainingMs = Math.max(0, expiryDate.getTime() - now.getTime());

  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  const isTrialActive = remainingMs > 0;
  const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));

  const monthsRemaining = Math.floor(daysRemaining / 30);
  const leftoverDays = daysRemaining % 30;
  let timeRemainingFormatted = '';
  if (daysRemaining <= 0) {
    timeRemainingFormatted = 'Trial expired';
  } else if (monthsRemaining >= 1) {
    timeRemainingFormatted = `${monthsRemaining} month${monthsRemaining > 1 ? 's' : ''}${leftoverDays > 0 ? `, ${leftoverDays} day${leftoverDays > 1 ? 's' : ''}` : ''}`;
  } else {
    timeRemainingFormatted = `${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`;
  }

  p.trial_started_at = startDate.toISOString();
  p.trial_expires_at = expiryDate.toISOString();
  p.trial_days_remaining = daysRemaining;
  p.trial_time_remaining = timeRemainingFormatted;
  p.trial_percentage_elapsed = percentElapsed;
  p.is_trial_active = isTrialActive;

  return p;
};

exports.formatProfile = formatProfile;

// Create or update the logged in scholar's profile
exports.upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = { ...req.body, user_id: userId };

    // Enforce default fee_paid = true for promo year if not specified
    if (profileData.fee_paid === undefined) {
      profileData.fee_paid = true;
    }

    let profile = await ScholarProfile.findOne({ where: { user_id: userId } });
    const isNewRegistration = !profile;

    if (profile) {
      // PREVENT RESETTING TRIAL:
      // When updating an existing profile, trial dates must NEVER be overwritten or pushed forward
      delete profileData.trial_started_at;
      delete profileData.trial_expires_at;

      // If existing profile was missing trial dates, seed from created_at
      if (!profile.trial_started_at) {
        const start = profile.created_at || new Date();
        profile.trial_started_at = start;
        profile.trial_expires_at = new Date(new Date(start).getTime() + 365 * 24 * 60 * 60 * 1000);
      }

      await profile.update(profileData);
    } else {
      // BRAND NEW REGISTRATION:
      // Start 1-Year Free Trial counting from this registration moment
      const now = new Date();
      profileData.trial_started_at = now;
      profileData.trial_expires_at = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      profile = await ScholarProfile.create(profileData);
    }

    // Also update User avatar if provided in profile payload
    if (req.body.avatar_url) {
      await User.update({ avatar_url: req.body.avatar_url }, { where: { id: userId } });
    }

    const updatedProfile = await ScholarProfile.findOne({
      where: { user_id: userId },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'avatar_url', 'role'] }]
    });

    // Invalidate directory cache so new/updated profile appears immediately in directory
    directoryCache.clear();

    return res.json({
      success: true,
      message: isNewRegistration ? 'Scholar profile registered successfully!' : 'Scholar profile updated successfully.',
      is_new_registration: isNewRegistration,
      profile: formatProfile(updatedProfile)
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get the authenticated scholar's personal profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await ScholarProfile.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'avatar_url', 'role'] }]
    });

    return res.json({
      success: true,
      profile: formatProfile(profile)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Directory in-memory caching for ultra-fast response times
const directoryCache = new Map();
const DIRECTORY_CACHE_TTL = 20 * 1000; // 20 seconds


// Public directory of scholars with search and filters
exports.getPublicDirectory = async (req, res) => {
  try {
    const {
      search = '',
      country = '',
      university = '',
      discipline = '',
      title = '',
      category = '',
      citationTier = '',
      sdg = '',
      sortBy = 'citations_count',
      order = 'DESC',
      page = 1,
      limit = 12
    } = req.query;

    const cacheKey = JSON.stringify({ search, country, university, discipline, title, category, citationTier, sdg, sortBy, order, page, limit });
    const cached = directoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < DIRECTORY_CACHE_TTL) {
      return res.json(cached.data);
    }

    const isPostgres = ScholarProfile.sequelize.getDialect() === 'postgres';
    const matchOp = isPostgres ? Op.iLike : Op.like;
    const conditions = [];

    if (country && country.trim()) {
      conditions.push({ country: { [matchOp]: `%${country.trim()}%` } });
    }
    if (university && university.trim()) {
      conditions.push({ university_name: { [matchOp]: `%${university.trim()}%` } });
    }
    if (discipline && discipline.trim()) {
      conditions.push({ discipline: { [matchOp]: `%${discipline.trim()}%` } });
    }
    if (title && title.trim()) {
      conditions.push({ title: title.trim() });
    }

    if (citationTier === '10000') {
      conditions.push({ citations_count: { [Op.gte]: 10000 } });
    } else if (citationTier === '5000') {
      conditions.push({ citations_count: { [Op.gte]: 5000 } });
    } else if (citationTier === '1000') {
      conditions.push({ citations_count: { [Op.gte]: 1000 } });
    } else if (citationTier === 'H20') {
      conditions.push({ google_h_index: { [Op.gte]: 20 } });
    }

    // Category filter: 'title' and 'highest_degree' are Postgres ENUM types
    // Use Op.in with valid enum literals to prevent operator does not exist errors
    if (category === 'PROFESSORIAL') {
      conditions.push({
        title: { [Op.in]: ['Full Prof', 'Associate Prof', 'Assistant Prof'] }
      });
    } else if (category === 'DOCTORAL') {
      conditions.push({
        [Op.or]: [
          { title: 'Dr' },
          { highest_degree: { [Op.in]: ['PhD', 'DSc'] } }
        ]
      });
    }

    if (sdg && sdg.trim()) {
      conditions.push({
        [Op.or]: [
          { discipline: { [matchOp]: `%${sdg.trim()}%` } },
          { research_focus: { [matchOp]: `%${sdg.trim()}%` } }
        ]
      });
    }

    if (search && search.trim()) {
      const q = search.trim();
      conditions.push({
        [Op.or]: [
          { first_name: { [matchOp]: `%${q}%` } },
          { surname: { [matchOp]: `%${q}%` } },
          { university_name: { [matchOp]: `%${q}%` } },
          { discipline: { [matchOp]: `%${q}%` } },
          { research_focus: { [matchOp]: `%${q}%` } }
        ]
      });
    }

    const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const validSortFields = ['citations_count', 'publications_count', 'google_h_index', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'citations_count';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: scholars } = await ScholarProfile.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortField, sortOrder]],
      distinct: true,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'avatar_url', 'is_verified']
        }
      ]
    });

    const responseData = {
      success: true,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      scholars: scholars.map(formatProfile)
    };

    directoryCache.set(cacheKey, { timestamp: Date.now(), data: responseData });
    // Keep directory cache size reasonable
    if (directoryCache.size > 200) {
      const oldestKey = directoryCache.keys().next().value;
      directoryCache.delete(oldestKey);
    }

    return res.json(responseData);
  } catch (error) {
    console.error('Error fetching directory:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single scholar's public profile
exports.getScholarById = async (req, res) => {
  try {
    const { id } = req.params;
    const scholar = await ScholarProfile.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'avatar_url', 'is_verified', 'created_at']
        }
      ]
    });

    if (!scholar) {
      return res.status(404).json({ success: false, message: 'Scholar not found.' });
    }

    return res.json({
      success: true,
      scholar: formatProfile(scholar)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

let cachedFilterOptions = null;
let cachedFilterOptionsTime = 0;
const FILTER_OPTIONS_TTL = 10 * 60 * 1000; // 10 minutes

// Summary metrics of professors by country and universities for directory filters
exports.getFilterOptions = async (req, res) => {
  try {
    if (cachedFilterOptions && Date.now() - cachedFilterOptionsTime < FILTER_OPTIONS_TTL) {
      return res.json(cachedFilterOptions);
    }

    const countries = await ScholarProfile.findAll({
      attributes: ['country'],
      group: ['country'],
      raw: true
    });

    const universities = await ScholarProfile.findAll({
      attributes: ['university_name'],
      group: ['university_name'],
      raw: true
    });

    const disciplines = await ScholarProfile.findAll({
      attributes: ['discipline'],
      group: ['discipline'],
      raw: true
    });

    const result = {
      success: true,
      countries: countries.map(c => c.country).filter(Boolean),
      universities: universities.map(u => u.university_name).filter(Boolean),
      disciplines: disciplines.map(d => d.discipline).filter(Boolean)
    };

    cachedFilterOptions = result;
    cachedFilterOptionsTime = Date.now();

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// External Universities API by Country
exports.getExternalUniversities = async (req, res) => {
  try {
    const { country = 'Nigeria' } = req.query;
    let queryCountry = country;
    if (country.includes('Congo')) {
      queryCountry = 'Congo';
    } else if (country === "Côte d'Ivoire") {
      queryCountry = 'Ivory Coast';
    }

    const http = require('http');
    const apiUrl = `http://universities.hipolabs.com/search?country=${encodeURIComponent(queryCountry)}`;

    http.get(apiUrl, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const list = Array.from(new Set(parsed.map(u => u.name))).sort();
          return res.json({ success: true, country, universities: list });
        } catch (_) {
          return res.json({ success: true, country, universities: [] });
        }
      });
    }).on('error', (err) => {
      console.warn('External university fetch error:', err.message);
      return res.json({ success: true, country, universities: [] });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

