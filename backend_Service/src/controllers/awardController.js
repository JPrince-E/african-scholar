const { Award, AwardApplication, ScholarProfile, User } = require('../models');
const emailService = require('../services/emailService');

const formatAward = (award) => {
  const a = award.toJSON ? award.toJSON() : { ...award };
  if (typeof a.award_value === 'string') {
    try { a.award_value = JSON.parse(a.award_value); } catch (_) {}
  }
  if (typeof a.evaluation_index === 'string') {
    try { a.evaluation_index = JSON.parse(a.evaluation_index); } catch (_) {}
  }
  return a;
};

// List active awards
exports.listAwards = async (req, res) => {
  try {
    const awards = await Award.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']]
    });

    return res.json({
      success: true,
      awards: awards.map(formatAward)
    });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single award
exports.getAwardById = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({ success: false, message: 'Award category not found.' });
    }

    return res.json({
      success: true,
      award: formatAward(award)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Apply for an award nomination
exports.applyForAward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { award_id, supporting_evidence } = req.body;

    if (!award_id || !supporting_evidence) {
      return res.status(400).json({
        success: false,
        message: 'Award ID and supporting evidence are required.'
      });
    }

    // Check scholar profile exists
    const profile = await ScholarProfile.findOne({ where: { user_id: userId } });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your scholar profile before applying for an award.'
      });
    }

    // Check if award exists
    const award = await Award.findByPk(award_id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found.' });
    }

    // Check for existing application (immutable, no duplicates allowed)
    const existing = await AwardApplication.findOne({
      where: { user_id: userId, award_id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this award. Submitted applications cannot be edited or resubmitted.'
      });
    }

    // Requirement 15: Users registered > 1 year must pay $1 USD per application. First year is completely free.
    const user = await User.findByPk(userId);
    const registeredAt = new Date(user?.createdAt || user?.created_at || (profile && profile.created_at) || Date.now());
    const now = new Date();
    const ONE_YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
    const isFirstYear = (now.getTime() - registeredAt.getTime()) < ONE_YEAR_MS;

    const { payment_reference } = req.body;

    if (!isFirstYear) {
      if (!payment_reference) {
        return res.status(402).json({
          success: false,
          requires_payment: true,
          is_first_year: false,
          fee_amount_usd: 1.00,
          message: 'Your complimentary 1-year award application window has elapsed. An administrative verification fee of $1 USD is required to submit this nomination.'
        });
      }
    }

    const application = await AwardApplication.create({
      user_id: userId,
      award_id,
      supporting_evidence,
      status: 'SUBMITTED',
      submitted_at: new Date(),
      is_first_year: isFirstYear,
      payment_status: isFirstYear ? 'FREE_FIRST_YEAR' : 'PAID',
      payment_reference: isFirstYear ? 'FREE_FIRST_YEAR_WAIVER' : (payment_reference || 'PAID_1_USD'),
      application_fee_usd: isFirstYear ? 0.00 : 1.00
    });

    // Send confirmation email asynchronously
    if (user) {
      emailService.sendApplicationSubmittedEmail({
        email: user.email,
        name: `${profile.title} ${profile.first_name} ${profile.surname}`,
        awardTitle: award.title,
        tier: award.tier,
        applicationId: application.id
      }).catch(err => console.error('Failed sending nomination confirmation email:', err.message));
    }

    return res.status(201).json({
      success: true,
      message: 'Your award nomination application has been submitted successfully and is locked for review.',
      application
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check if user is within their first year (free) or requires $1 payment
exports.checkApplicationEligibility = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const registeredAt = new Date(user.createdAt || user.created_at || Date.now());
    const now = new Date();
    const ONE_YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
    const isFirstYear = (now.getTime() - registeredAt.getTime()) < ONE_YEAR_MS;
    const oneYearAnniversary = new Date(registeredAt.getTime() + ONE_YEAR_MS);

    return res.json({
      success: true,
      registered_at: registeredAt,
      is_first_year: isFirstYear,
      one_year_anniversary: oneYearAnniversary,
      fee_amount_usd: isFirstYear ? 0.00 : 1.00,
      message: isFirstYear
        ? 'First year privilege active: Award nominations are completely free.'
        : 'Complimentary 1-year window elapsed: $1 USD processing fee applies.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user's submitted applications (private to the user)
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await AwardApplication.findAll({
      where: { user_id: userId },
      include: [{ model: Award, as: 'award' }],
      order: [['submitted_at', 'DESC']]
    });

    return res.json({
      success: true,
      applications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all awards (including inactive)
exports.getAllAwardsAdmin = async (req, res) => {
  try {
    const awards = await Award.findAll({
      order: [['id', 'ASC']]
    });
    return res.json({
      success: true,
      awards: awards.map(formatAward)
    });
  } catch (error) {
    console.error('Error fetching admin awards:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create new award
exports.createAward = async (req, res) => {
  try {
    const { tier, title, country, description, award_value, evaluation_index, year, is_active } = req.body;

    if (!tier || !title || !evaluation_index) {
      return res.status(400).json({
        success: false,
        message: 'Award tier, title, and evaluation index criteria are required.'
      });
    }

    const award = await Award.create({
      tier,
      title,
      country: country || null,
      description: description || '',
      award_value: award_value || { prize_amount: '$5,000', plaque: 'Official Plaque', podcast_interview: 'Yes', icon_items: 'Yes' },
      evaluation_index: evaluation_index || [],
      year: year || 2027,
      is_active: is_active !== undefined ? is_active : true
    });

    return res.status(201).json({
      success: true,
      message: 'Award category created successfully.',
      award: formatAward(award)
    });
  } catch (error) {
    console.error('Error creating award:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update award
exports.updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { tier, title, country, description, award_value, evaluation_index, year, is_active } = req.body;

    const award = await Award.findByPk(id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found.' });
    }

    if (tier) award.tier = tier;
    if (title) award.title = title;
    if (country !== undefined) award.country = country;
    if (description !== undefined) award.description = description;
    if (award_value !== undefined) award.award_value = award_value;
    if (evaluation_index !== undefined) award.evaluation_index = evaluation_index;
    if (year !== undefined) award.year = year;
    if (is_active !== undefined) award.is_active = is_active;

    await award.save();

    return res.json({
      success: true,
      message: 'Award category updated successfully.',
      award: formatAward(award)
    });
  } catch (error) {
    console.error('Error updating award:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete award
exports.deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found.' });
    }

    await award.destroy();

    return res.json({
      success: true,
      message: 'Award category deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting award:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
