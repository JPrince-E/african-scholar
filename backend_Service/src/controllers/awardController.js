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

    const application = await AwardApplication.create({
      user_id: userId,
      award_id,
      supporting_evidence,
      status: 'SUBMITTED',
      submitted_at: new Date()
    });

    // Send confirmation email asynchronously
    const user = await User.findByPk(userId);
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
      year: year || 2026,
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
