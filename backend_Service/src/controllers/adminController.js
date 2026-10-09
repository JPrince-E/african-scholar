const { User, ScholarProfile, Award, AwardApplication, sequelize } = require('../models');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');

// Aggregated Platform Analytics for Admin Dashboard
exports.getAnalytics = async (req, res) => {
  try {
    const totalProfessors = await ScholarProfile.count();
    const totalUsers = await User.count();
    const totalApplications = await AwardApplication.count();
    const totalAwards = await Award.count();

    // Professors count by Country
    const professorsByCountry = await ScholarProfile.findAll({
      attributes: [
        'country',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['country'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true
    });

    // Professors count by University
    const professorsByUniversity = await ScholarProfile.findAll({
      attributes: [
        'university_name',
        'country',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['university_name', 'country'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      raw: true
    });

    // Aggregate academic impact metrics
    const impactMetrics = await ScholarProfile.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('publications_count')), 'total_publications'],
        [sequelize.fn('SUM', sequelize.col('citations_count')), 'total_citations'],
        [sequelize.fn('AVG', sequelize.col('google_h_index')), 'avg_h_index'],
        [sequelize.fn('SUM', sequelize.col('patents_count')), 'total_patents'],
        [sequelize.fn('SUM', sequelize.col('grants_count')), 'total_grants']
      ],
      raw: true
    });

    // Applications count by status
    const applicationsByStatus = await AwardApplication.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Applications count by Award Tier
    const applicationsByTier = await AwardApplication.findAll({
      include: [{ model: Award, as: 'award', attributes: ['tier', 'title'] }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('AwardApplication.id')), 'count']
      ],
      group: ['award.tier', 'award.id', 'award.title'],
      raw: true
    });

    return res.json({
      success: true,
      analytics: {
        totalProfessors,
        totalUsers,
        totalApplications,
        totalAwards,
        professorsByCountry,
        professorsByUniversity,
        impactMetrics: {
          total_publications: parseInt(impactMetrics.total_publications || 0),
          total_citations: parseInt(impactMetrics.total_citations || 0),
          avg_h_index: Math.round((parseFloat(impactMetrics.avg_h_index) || 0) * 10) / 10,
          total_patents: parseInt(impactMetrics.total_patents || 0),
          total_grants: parseInt(impactMetrics.total_grants || 0)
        },
        applicationsByStatus,
        applicationsByTier
      }
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all applications for review
exports.getAllApplications = async (req, res) => {
  try {
    const { status, award_id, country } = req.query;
    const where = {};
    const profileWhere = {};

    if (status) where.status = status;
    if (award_id) where.award_id = award_id;
    if (country) profileWhere.country = country;

    const applications = await AwardApplication.findAll({
      where,
      include: [
        {
          model: Award,
          as: 'award'
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email', 'avatar_url'],
          include: [
            {
              model: ScholarProfile,
              as: 'profile',
              where: Object.keys(profileWhere).length ? profileWhere : undefined
            }
          ]
        }
      ],
      order: [['submitted_at', 'DESC']]
    });

    return res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single application with full details
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await AwardApplication.findByPk(id, {
      include: [
        { model: Award, as: 'award' },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email', 'avatar_url'],
          include: [{ model: ScholarProfile, as: 'profile' }]
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    return res.json({
      success: true,
      application
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Review an application
exports.reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comments, score_details } = req.body;

    const application = await AwardApplication.findByPk(id, {
      include: [
        { model: Award, as: 'award' },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email'],
          include: [{ model: ScholarProfile, as: 'profile' }]
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (admin_comments !== undefined) updates.admin_comments = admin_comments;
    if (score_details !== undefined) updates.score_details = score_details;

    await application.update(updates);

    // Send email notification to applicant asynchronously
    if (application.applicant?.email) {
      const profile = application.applicant.profile;
      const scholarName = profile ? `${profile.title} ${profile.first_name} ${profile.surname}` : application.applicant.email;
      emailService.sendApplicationVerdictEmail({
        email: application.applicant.email,
        name: scholarName,
        awardTitle: application.award?.title || 'Academic Award',
        tier: application.award?.tier || 'National',
        status: status || application.status,
        adminComments: admin_comments || application.admin_comments,
        scoreDetails: score_details || application.score_details
      }).catch(e => console.error('Failed sending verdict email:', e.message));
    }

    return res.json({
      success: true,
      message: 'Application review updated successfully.',
      application
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Declare an application as winner
exports.declareWinner = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_comments } = req.body;

    const application = await AwardApplication.findByPk(id, {
      include: [
        { model: Award, as: 'award' },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email'],
          include: [{ model: ScholarProfile, as: 'profile' }]
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const verdictComment = admin_comments || 'Selected as Official Winner of the Year.';
    await application.update({
      status: 'AWARDED',
      admin_comments: verdictComment
    });

    // Send official Laureate notification email asynchronously
    if (application.applicant?.email) {
      const profile = application.applicant.profile;
      const scholarName = profile ? `${profile.title} ${profile.first_name} ${profile.surname}` : application.applicant.email;
      const certCode = `AS-2026-${String(application.id).padStart(4, '0')}`;

      let prizeAmount = '$5,000';
      if (application.award?.award_value) {
        const val = typeof application.award.award_value === 'string' ? JSON.parse(application.award.award_value) : application.award.award_value;
        prizeAmount = val.prize_amount || '$5,000';
      }

      emailService.sendLaureateAwardEmail({
        email: application.applicant.email,
        name: scholarName,
        awardTitle: application.award?.title || 'Academic Award',
        tier: application.award?.tier || 'Continental',
        prizeAmount,
        citation: verdictComment,
        certificateCode: certCode
      }).catch(e => console.error('Failed sending laureate award email:', e.message));
    }

    return res.json({
      success: true,
      message: 'Candidate has been officially awarded the Winner status.',
      application
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
