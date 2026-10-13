const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleMiddleware');

// Public
router.get('/active', advertisementController.getActiveAds);
router.post('/apply', advertisementController.applyForAd);
router.post('/:id/click', advertisementController.recordClick);

// Admin
router.get('/admin/all', authMiddleware, roleGuard(['SUPER_ADMIN']), advertisementController.getAllAdsAdmin);
router.post('/admin/create', authMiddleware, roleGuard(['SUPER_ADMIN']), advertisementController.createAdAdmin);
router.put('/admin/:id/approve', authMiddleware, roleGuard(['SUPER_ADMIN']), advertisementController.approveAdAdmin);
router.put('/admin/:id/reject', authMiddleware, roleGuard(['SUPER_ADMIN']), advertisementController.rejectAdAdmin);
router.put('/admin/:id/toggle', authMiddleware, roleGuard(['SUPER_ADMIN']), advertisementController.toggleAdStatusAdmin);
router.delete('/admin/:id', authMiddleware, roleGuard(['SUPER_ADMIN']), advertisementController.deleteAdAdmin);

module.exports = router;
