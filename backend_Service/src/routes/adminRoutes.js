const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleMiddleware');

// All routes here require ADMIN authentication
router.use(authMiddleware);
router.use(roleGuard(['SUPER_ADMIN', 'REVIEWER']));

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Applications review & management
router.get('/applications', adminController.getAllApplications);
router.get('/applications/:id', adminController.getApplicationById);
router.put('/applications/:id/review', adminController.reviewApplication);
router.put('/applications/:id/winner', adminController.declareWinner);

module.exports = router;
