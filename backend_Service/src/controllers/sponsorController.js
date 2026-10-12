const { Sponsor } = require('../models');

// Public: Get active sponsors
exports.getActiveSponsors = async (req, res) => {
  try {
    const { placement } = req.query;
    const where = { is_active: true };

    if (placement) {
      where.placement = placement;
    }

    const sponsors = await Sponsor.findAll({
      where,
      order: [['id', 'DESC']]
    });

    return res.json({
      success: true,
      sponsors
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all sponsors
exports.getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.findAll({
      order: [['id', 'DESC']]
    });

    return res.json({
      success: true,
      sponsors
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create sponsor
exports.createSponsor = async (req, res) => {
  try {
    const {
      sponsor_name,
      banner_image_url,
      redirect_url,
      placement,
      pricing_tier,
      pricing_rate,
      duration_details,
      business_description,
      category,
      contact_email,
      is_active
    } = req.body;

    if (!sponsor_name || !banner_image_url) {
      return res.status(400).json({
        success: false,
        message: 'Sponsor name and banner image are required.'
      });
    }

    const sponsor = await Sponsor.create({
      sponsor_name,
      banner_image_url,
      redirect_url,
      placement: placement || 'HERO_BANNER',
      pricing_tier: pricing_tier || 'MONTHLY',
      pricing_rate: pricing_rate || '$250/mo',
      duration_details: duration_details || '1 Month Placement',
      business_description: business_description || null,
      category: category || 'Corporate & Academic Service',
      contact_email: contact_email || null,
      is_active: is_active !== undefined ? is_active : true
    });

    return res.status(201).json({
      success: true,
      message: 'Sponsor ad created successfully.',
      sponsor
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public: Submit Ad Inquiry from businesses
exports.submitAdInquiry = async (req, res) => {
  try {
    const {
      business_name,
      contact_name,
      contact_email,
      website_url,
      pricing_tier,
      message,
      banner_image_url
    } = req.body;

    if (!business_name || !contact_email) {
      return res.status(400).json({
        success: false,
        message: 'Business name and contact email are required.'
      });
    }

    const pricingRates = {
      'HOURLY': '$2/hr (Custom Hours / Day)',
      'DAILY': '$15/day (24 Hours Featured)',
      'WEEKLY': '$80/wk (7 Days Multi-portal)',
      'MONTHLY': '$250/mo (30 Days Priority Showcase)',
      'YEARLY': '$2,400/yr (365 Days Flagship Partnership)'
    };

    const sponsor = await Sponsor.create({
      sponsor_name: business_name,
      banner_image_url: banner_image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      redirect_url: website_url || null,
      placement: 'HERO_BANNER',
      pricing_tier: pricing_tier || 'MONTHLY',
      pricing_rate: pricingRates[pricing_tier] || '$250/mo',
      duration_details: `${pricing_tier || 'MONTHLY'} Advertising Plan`,
      business_description: message || `Advertising inquiry by ${contact_name || business_name}`,
      category: 'Business Advertiser',
      contact_email,
      is_active: true
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your advertising placement request has been submitted and is active for admin review.',
      sponsor
    });
  } catch (error) {
    console.error('Ad inquiry submission error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update sponsor
exports.updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({ success: false, message: 'Sponsor not found.' });
    }

    await sponsor.update(req.body);

    return res.json({
      success: true,
      message: 'Sponsor updated successfully.',
      sponsor
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete sponsor
exports.deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({ success: false, message: 'Sponsor not found.' });
    }

    await sponsor.destroy();

    return res.json({
      success: true,
      message: 'Sponsor deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
