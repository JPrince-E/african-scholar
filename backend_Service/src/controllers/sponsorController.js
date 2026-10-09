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
    const { sponsor_name, banner_image_url, redirect_url, placement, is_active } = req.body;

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
      is_active: is_active !== undefined ? is_active : true
    });

    return res.status(201).json({
      success: true,
      message: 'Sponsor created successfully.',
      sponsor
    });
  } catch (error) {
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
