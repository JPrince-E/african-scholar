const crypto = require('crypto');
const { RefereeEndorsement, AwardApplication, User, ScholarProfile, Award, Notification } = require('../models');
const emailService = require('../services/emailService');

exports.inviteReferee = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { refereeName, refereeEmail, refereeInstitution, refereeTitle } = req.body;

    if (!refereeName || !refereeEmail) {
      return res.status(400).json({ success: false, message: 'Referee name and email are required.' });
    }

    const application = await AwardApplication.findByPk(applicationId, {
      include: [
        {
          model: User,
          as: 'applicant',
          include: [{ model: ScholarProfile, as: 'profile' }]
        },
        { model: Award, as: 'award' }
      ]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Nomination application not found.' });
    }

    // Generate secure random token
    const token = crypto.randomBytes(24).toString('hex');

    const endorsement = await RefereeEndorsement.create({
      application_id: application.id,
      scholar_user_id: application.user_id,
      referee_name: refereeName.trim(),
      referee_email: refereeEmail.trim().toLowerCase(),
      referee_institution: refereeInstitution ? refereeInstitution.trim() : null,
      referee_title: refereeTitle ? refereeTitle.trim() : null,
      token,
      status: 'INVITED'
    });

    const candidateProfile = application.applicant?.profile;
    const candidateName = candidateProfile
      ? `${candidateProfile.title || 'Prof.'} ${candidateProfile.first_name} ${candidateProfile.surname}`
      : 'African Scholar Candidate';
    
    const candidateInstitution = candidateProfile?.primary_affiliation || 'Academic Institution';
    const awardTitle = application.award?.title || 'African Scholar Honors';
    const clientBaseUrl = process.env.USER_CLIENT_URL || 'http://localhost:3000';
    const endorsementUrl = `${clientBaseUrl}/endorse/${token}`;

    // Send invitation email in background
    emailService.sendRefereeInvitationEmail({
      refereeEmail: refereeEmail.trim(),
      refereeName: refereeName.trim(),
      candidateName,
      candidateInstitution,
      awardTitle,
      endorsementUrl
    }).catch(err => console.error('Referee email dispatch failed:', err));

    return res.status(201).json({
      success: true,
      message: `Invitation successfully dispatched to ${refereeEmail}`,
      endorsement: {
        id: endorsement.id,
        referee_name: endorsement.referee_name,
        referee_email: endorsement.referee_email,
        referee_institution: endorsement.referee_institution,
        status: endorsement.status,
        token: endorsement.token,
        endorsementUrl
      }
    });

  } catch (error) {
    console.error('Invite referee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEndorsementByToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Endorsement token required.' });
    }

    const endorsement = await RefereeEndorsement.findOne({
      where: { token },
      include: [
        {
          model: AwardApplication,
          as: 'application',
          include: [
            {
              model: User,
              as: 'applicant',
              include: [{ model: ScholarProfile, as: 'profile' }]
            },
            { model: Award, as: 'award' }
          ]
        }
      ]
    });

    if (!endorsement) {
      return res.status(404).json({ success: false, message: 'Invalid or expired endorsement token.' });
    }

    const app = endorsement.application;
    const profile = app?.applicant?.profile;
    const candidateName = profile
      ? `${profile.title || 'Prof.'} ${profile.first_name} ${profile.surname}, ${profile.highest_degree || 'PhD'}`
      : 'African Scholar Candidate';

    return res.json({
      success: true,
      endorsement: {
        id: endorsement.id,
        referee_name: endorsement.referee_name,
        referee_email: endorsement.referee_email,
        referee_institution: endorsement.referee_institution,
        referee_title: endorsement.referee_title,
        status: endorsement.status,
        submitted_at: endorsement.submitted_at,
        ratings: endorsement.ratings,
        confidential_comments: endorsement.confidential_comments,
        candidate: {
          name: candidateName,
          institution: profile?.primary_affiliation || 'Academic Institution',
          faculty: profile?.faculty || 'Academic Faculty',
          country: profile?.nationality || 'Africa',
          awardTitle: app?.award?.title || 'Academic Excellence Award',
          category: app?.award?.category || 'STEM & Continental Research'
        }
      }
    });

  } catch (error) {
    console.error('Get endorsement error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitEndorsement = async (req, res) => {
  try {
    const { token } = req.params;
    const { ratings, confidential_comments, recommendation_letter_url } = req.body;

    const endorsement = await RefereeEndorsement.findOne({ where: { token } });
    if (!endorsement) {
      return res.status(404).json({ success: false, message: 'Endorsement token not found.' });
    }

    endorsement.ratings = ratings || { academicRigor: 5, continentalImpact: 5, leadership: 5 };
    endorsement.confidential_comments = confidential_comments || '';
    endorsement.recommendation_letter_url = recommendation_letter_url || null;
    endorsement.status = 'SUBMITTED';
    endorsement.submitted_at = new Date();
    await endorsement.save();

    // Create in-app notification for the applicant
    Notification.create({
      user_id: endorsement.scholar_user_id,
      title: 'Peer Endorsement Received',
      message: `Your referee ${endorsement.referee_name} has submitted their confidential recommendation for your nomination dossier.`,
      type: 'REFEREE',
      link: '/dashboard'
    }).catch(err => console.error('Notification creation failed:', err));

    return res.json({
      success: true,
      message: 'Confidential endorsement successfully submitted to the Continental Academic Jury.',
      endorsement
    });

  } catch (error) {
    console.error('Submit endorsement error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplicationReferees = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const referees = await RefereeEndorsement.findAll({
      where: { application_id: applicationId },
      attributes: ['id', 'referee_name', 'referee_email', 'referee_institution', 'referee_title', 'status', 'token', 'submitted_at', 'createdAt']
    });

    res.json({ success: true, referees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
