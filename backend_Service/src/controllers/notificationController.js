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
          user_id: null,
          title: 'Nomination Cycle 2027 Open',
          message: 'The Continental Academic Jury is now accepting nominations for the 2027 African Academic Laureate Honors.',
          type: 'AWARD',
          link: '/awards',
          is_read: false,
          read_by: []
        },
        {
          user_id: null,
          title: 'Crossref & ORCID Sync Active',
          message: 'You can now auto-verify DOIs and import your research works directly from Crossref and ORCID.',
          type: 'INFO',
          link: '/awards/apply',
          is_read: false,
          read_by: []
        },
        {
          user_id: null,
          title: 'Mastercard Foundation Scholars Initiative',
          message: 'New continental STEM capacity grant partnership launched. Check out the sponsor initiatives.',
          type: 'SPONSOR',
          link: '/dashboard',
          is_read: false,
          read_by: []
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

    // Format notifications with personalized is_read status for this specific user
    const formatted = notifications.map(n => {
      const item = n.toJSON ? n.toJSON() : { ...n };
      const readList = Array.isArray(item.read_by) ? item.read_by : [];
      
      let isReadForThisUser = false;
      if (item.user_id && item.user_id === userId) {
        isReadForThisUser = Boolean(item.is_read);
      } else if (userId && readList.includes(userId)) {
        isReadForThisUser = true;
      }

      return {
        ...item,
        is_read: isReadForThisUser
      };
    });

    const unreadCount = formatted.filter(n => !n.is_read).length;

    res.json({
      success: true,
      unreadCount,
      notifications: formatted
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const notification = await Notification.findByPk(id);

    if (notification) {
      if (notification.user_id && notification.user_id === userId) {
        // Direct personal notification for this user
        notification.is_read = true;
        await notification.save();
      } else if (userId) {
        // Broadcast notification: record this user in read_by array so others remain unaffected
        const existing = Array.isArray(notification.read_by) ? [...notification.read_by] : [];
        if (!existing.includes(userId)) {
          existing.push(userId);
          notification.read_by = existing;
          await notification.save();
        }
      } else {
        notification.is_read = true;
        await notification.save();
      }
    }
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    if (userId) {
      // 1. Mark personal notifications as read
      await Notification.update(
        { is_read: true },
        { where: { user_id: userId } }
      );

      // 2. Add userId to read_by on all broadcast notifications without marking them read for other users
      const broadcasts = await Notification.findAll({
        where: { user_id: null }
      });
      for (const b of broadcasts) {
        const existing = Array.isArray(b.read_by) ? [...b.read_by] : [];
        if (!existing.includes(userId)) {
          existing.push(userId);
          b.read_by = existing;
          await b.save();
        }
      }
    } else {
      await Notification.update({ is_read: true }, { where: {} });
    }
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
