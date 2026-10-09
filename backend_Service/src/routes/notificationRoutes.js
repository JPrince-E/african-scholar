const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// In-app notifications endpoints for Users
router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

// Admin Control Endpoints (used by admin_service)
router.get('/admin/all', notificationController.getAllNotificationsAdmin);
router.post('/admin/create', notificationController.createNotification);
router.delete('/admin/:id', notificationController.deleteNotification);

module.exports = router;
