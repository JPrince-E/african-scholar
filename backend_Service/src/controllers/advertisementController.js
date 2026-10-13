const { Advertisement, User, ScholarProfile } = require('../models');

// Public: Get live approved ads
exports.getActiveAds = async (req, res) => {
  try {
    const { placement } = req.query;
    const where = {
      status: 'APPROVED',
      is_active: true
    };

    if (placement) {
      where.placement = placement;
    }

    const ads = await Advertisement.findAll({
      where,
      order: [['id', 'DESC']]
    });

    return res.json({
      success: true,
      advertisements: ads
    });
  } catch (error) {
    console.error('Error fetching active ads:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public/User: Apply to advertise on the site
exports.applyForAd = async (req, res) => {
  try {
    const {
      business_name,
      contact_name,
      contact_email,
      contact_phone,
      headline,
      description,
      banner_image_url,
      target_url,
      placement = 'HERO_BANNER',
      pricing_tier = 'MONTHLY',
      amount_usd = 250,
      payment_reference,
      payment_status = 'PENDING'
    } = req.body;

    if (!business_name || !contact_email || !headline || !banner_image_url) {
      return res.status(400).json({
        success: false,
        message: 'Business name, contact email, ad headline, and banner image are required.'
      });
    }

    const userId = req.user?.id || null;

    const ad = await Advertisement.create({
      user_id: userId,
      business_name,
      contact_name: contact_name || business_name,
      contact_email,
      contact_phone: contact_phone || null,
      headline,
      description: description || null,
      banner_image_url,
      target_url: target_url || null,
      placement,
      pricing_tier,
      amount_usd: parseFloat(amount_usd) || 250,
      payment_status: payment_status || (payment_reference ? 'PAID' : 'PENDING'),
      payment_reference: payment_reference || null,
      status: 'PENDING_REVIEW', // MUST be accepted by Admin before going live!
      is_active: false
    });

    return res.status(201).json({
      success: true,
      message: 'Advertisement application submitted successfully! It is now pending review and approval by the administrative board.',
      advertisement: ad
    });
  } catch (error) {
    console.error('Error submitting ad application:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Track ad click
exports.recordClick = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);
    if (ad) {
      await ad.increment('clicks_count');
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all ads (Pending, Approved, Rejected)
exports.getAllAdsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) {
      where.status = status;
    }

    const ads = await Advertisement.findAll({
      where,
      order: [['id', 'DESC']]
    });

    const pendingCount = await Advertisement.count({ where: { status: 'PENDING_REVIEW' } });
    const approvedCount = await Advertisement.count({ where: { status: 'APPROVED' } });
    const rejectedCount = await Advertisement.count({ where: { status: 'REJECTED' } });

    return res.json({
      success: true,
      advertisements: ads,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: ads.length
      }
    });
  } catch (error) {
    console.error('Error fetching admin ads:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Accept / Approve Ad -> Goes live immediately!
exports.approveAdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes, placement } = req.body;

    const ad = await Advertisement.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    await ad.update({
      status: 'APPROVED',
      is_active: true,
      placement: placement || ad.placement,
      admin_notes: admin_notes || 'Approved for continental display.'
    });

    return res.json({
      success: true,
      message: `Advertisement for "${ad.business_name}" approved and is now live on the platform!`,
      advertisement: ad
    });
  } catch (error) {
    console.error('Error approving ad:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Reject Ad
exports.rejectAdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const ad = await Advertisement.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    await ad.update({
      status: 'REJECTED',
      is_active: false,
      admin_notes: admin_notes || 'Does not meet current academic advertising standards.'
    });

    return res.json({
      success: true,
      message: `Advertisement for "${ad.business_name}" rejected.`,
      advertisement: ad
    });
  } catch (error) {
    console.error('Error rejecting ad:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Toggle active status (Pause / Resume)
exports.toggleAdStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    const nextState = !ad.is_active;
    await ad.update({ is_active: nextState });

    return res.json({
      success: true,
      message: `Advertisement ${nextState ? 'resumed' : 'paused'}.`,
      advertisement: ad
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete ad
exports.deleteAdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    await ad.destroy();
    return res.json({
      success: true,
      message: 'Advertisement deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create ad directly
exports.createAdAdmin = async (req, res) => {
  try {
    const {
      business_name,
      contact_name,
      contact_email,
      headline,
      description,
      banner_image_url,
      target_url,
      placement = 'HERO_BANNER',
      pricing_tier = 'MONTHLY',
      amount_usd = 250,
      is_active = true
    } = req.body;

    const ad = await Advertisement.create({
      business_name,
      contact_name: contact_name || business_name,
      contact_email: contact_email || 'admin@africanscholar.org',
      headline,
      description,
      banner_image_url,
      target_url,
      placement,
      pricing_tier,
      amount_usd,
      payment_status: 'PAID',
      status: 'APPROVED',
      is_active: is_active !== undefined ? is_active : true
    });

    return res.status(201).json({
      success: true,
      message: 'Advertisement created and published successfully.',
      advertisement: ad
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
