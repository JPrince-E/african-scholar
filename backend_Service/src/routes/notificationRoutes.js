const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const notificationController = require('../controllers/notificationController');

// Optional auth: populate req.user if Bearer token is provided
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_african_scholar_2027');
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'role', 'avatar_url', 'is_verified']
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // If token invalid, proceed gracefully as guest
  }
  next();
};

// In-app notifications endpoints for Users
router.get('/', optionalAuth, notificationController.getNotifications);
router.put('/:id/read', optionalAuth, notificationController.markAsRead);
router.post('/read-all', optionalAuth, notificationController.markAllAsRead);

// Admin Control Endpoints (used by admin_service)
router.get('/admin/all', notificationController.getAllNotificationsAdmin);
router.post('/admin/create', notificationController.createNotification);
router.delete('/admin/:id', notificationController.deleteNotification);

module.exports = router;
