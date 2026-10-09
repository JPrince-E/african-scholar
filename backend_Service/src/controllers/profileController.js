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
  return p;
};

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

    if (profile) {
      await profile.update(profileData);
    } else {
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

    return res.json({
      success: true,
      message: 'Profile saved successfully.',
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

// Public directory of scholars with search and filters
exports.getPublicDirectory = async (req, res) => {
  try {
    const {
      search = '',
      country = '',
      university = '',
      discipline = '',
      title = '',
      sortBy = 'citations_count',
      order = 'DESC',
      page = 1,
      limit = 12
    } = req.query;

    const where = {};

    if (country) {
      where.country = country;
    }
    if (university) {
      where.university_name = university;
    }
    if (discipline) {
      where.discipline = { [Op.like]: `%${discipline}%` };
    }
    if (title) {
      where.title = title;
    }

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { surname: { [Op.like]: `%${search}%` } },
        { university_name: { [Op.like]: `%${search}%` } },
        { discipline: { [Op.like]: `%${search}%` } },
        { research_focus: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const validSortFields = ['citations_count', 'publications_count', 'google_h_index', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'citations_count';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: scholars } = await ScholarProfile.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortField, sortOrder]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'avatar_url', 'is_verified']
        }
      ]
    });

    return res.json({
      success: true,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      scholars: scholars.map(formatProfile)
    });
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

// Summary metrics of professors by country and universities for directory filters
exports.getFilterOptions = async (req, res) => {
  try {
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

    return res.json({
      success: true,
      countries: countries.map(c => c.country).filter(Boolean),
      universities: universities.map(u => u.university_name).filter(Boolean),
      disciplines: disciplines.map(d => d.discipline).filter(Boolean)
    });
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

