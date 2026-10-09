const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    let notifications = await Notification.findAll({
      where: userId ? { user_id: [userId, null] } : {},
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    // If none exist in database, seed realistic initial alerts
    if (notifications.length === 0) {
      const initialAlerts = [
        {
          user_id: userId,
          title: 'Nomination Cycle 2026 Open',
          message: 'The Continental Academic Jury is now accepting nominations for the 2026 African Academic Laureate Honors.',
          type: 'AWARD',
          link: '/awards',
          is_read: false
        },
        {
          user_id: userId,
          title: 'Crossref & ORCID Sync Active',
          message: 'You can now auto-verify DOIs and import your research works directly from Crossref and ORCID.',
          type: 'INFO',
          link: '/awards/apply',
          is_read: false
        },
        {
          user_id: userId,
          title: 'Mastercard Foundation Scholars Initiative',
          message: 'New continental STEM capacity grant partnership launched. Check out the sponsor initiatives.',
          type: 'SPONSOR',
          link: '/dashboard',
          is_read: true
        }
      ];

      for (const alert of initialAlerts) {
        await Notification.create(alert);
      }

      notifications = await Notification.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10
      });
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (notification) {
      notification.is_read = true;
      await notification.save();
    }
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    await Notification.update(
      { is_read: true },
      { where: userId ? { user_id: [userId, null] } : {} }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Controller Endpoints
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, link, target_user_id } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and Message are required.' });
    }

    const newNotification = await Notification.create({
      user_id: target_user_id || null, // null means broadcast to all users
      title,
      message,
      type: type || 'INFO',
      link: link || '/dashboard',
      is_read: false
    });

    res.status(201).json({
      success: true,
      message: 'Notification successfully broadcasted to users!',
      notification: newNotification
    });
  } catch (error) {
    console.error('Admin create notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllNotificationsAdmin = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Admin fetch notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Admin delete notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
