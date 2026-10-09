const { JuryReview, AwardApplication, User, ScholarProfile, Award } = require('../models');

exports.submitJuryReview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { juror_name, juror_region, juror_role, scores, recommendation, confidential_notes } = req.body;

    if (!juror_name || !scores) {
      return res.status(400).json({ success: false, message: 'Juror name and rubric scores are required.' });
    }

    const application = await AwardApplication.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const researchImpact = Number(scores.researchImpact || 0);
    const continentalRelevance = Number(scores.continentalRelevance || 0);
    const mentorship = Number(scores.mentorship || 0);
    const grants = Number(scores.grants || 0);

    const compositeScore = Math.min(100, Math.max(0, researchImpact + continentalRelevance + mentorship + grants));

    // Create or update review from this juror
    let review = await JuryReview.findOne({
      where: {
        application_id: applicationId,
        juror_name: juror_name.trim()
      }
    });

    if (review) {
      review.juror_region = juror_region || review.juror_region;
      review.juror_role = juror_role || review.juror_role;
      review.scores = { researchImpact, continentalRelevance, mentorship, grants };
      review.composite_score = compositeScore;
      review.recommendation = recommendation || 'RECOMMENDED';
      review.confidential_notes = confidential_notes || '';
      review.submitted_at = new Date();
      await review.save();
    } else {
      review = await JuryReview.create({
        application_id: applicationId,
        juror_name: juror_name.trim(),
        juror_region: juror_region || 'Continental Jury',
        juror_role: juror_role || 'Academic Reviewer',
        scores: { researchImpact, continentalRelevance, mentorship, grants },
        composite_score: compositeScore,
        recommendation: recommendation || 'RECOMMENDED',
        confidential_notes: confidential_notes || '',
        submitted_at: new Date()
      });
    }

    // Recalculate consensus across all reviews
    const allReviews = await JuryReview.findAll({ where: { application_id: applicationId } });
    const count = allReviews.length;
    const totalScore = allReviews.reduce((sum, r) => sum + r.composite_score, 0);
    const consensusAverage = Math.round((totalScore / count) * 10) / 10;

    // Variance calculation
    const variance = count > 1 
      ? Math.round(allReviews.reduce((sum, r) => sum + Math.pow(r.composite_score - consensusAverage, 2), 0) / count * 10) / 10
      : 0;

    // Update application score_details with consensus
    const scoreDetails = application.score_details || {};
    scoreDetails.consensusAverage = consensusAverage;
    scoreDetails.reviewCount = count;
    scoreDetails.scoreVariance = variance;
    scoreDetails.lastScoredAt = new Date();
    application.score_details = scoreDetails;
    await application.save();

    return res.json({
      success: true,
      message: 'Juror scorecard recorded successfully',
      review,
      consensus: {
        averageScore: consensusAverage,
        reviewCount: count,
        variance,
        allReviews
      }
    });

  } catch (error) {
    console.error('Submit jury review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplicationJuryReviews = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const reviews = await JuryReview.findAll({
      where: { application_id: applicationId },
      order: [['submitted_at', 'DESC']]
    });

    const count = reviews.length;
    const totalScore = reviews.reduce((sum, r) => sum + r.composite_score, 0);
    const averageScore = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;
    const variance = count > 1 
      ? Math.round(reviews.reduce((sum, r) => sum + Math.pow(r.composite_score - averageScore, 2), 0) / count * 10) / 10
      : 0;

    res.json({
      success: true,
      reviews,
      consensus: {
        averageScore,
        reviewCount: count,
        variance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
