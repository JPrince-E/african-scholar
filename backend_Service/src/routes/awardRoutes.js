const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleMiddleware');

// Public award list & details
router.get('/', awardController.listAwards);

// Admin management routes
router.get('/admin/all', authMiddleware, roleGuard(['SUPER_ADMIN', 'REVIEWER']), awardController.getAllAwardsAdmin);
router.post('/admin/create', authMiddleware, roleGuard(['SUPER_ADMIN']), awardController.createAward);
router.put('/admin/:id', authMiddleware, roleGuard(['SUPER_ADMIN']), awardController.updateAward);
router.delete('/admin/:id', authMiddleware, roleGuard(['SUPER_ADMIN']), awardController.deleteAward);

router.get('/:id', awardController.getAwardById);

// Protected user application submissions
router.post('/apply', authMiddleware, awardController.applyForAward);
router.get('/user/my-applications', authMiddleware, awardController.getMyApplications);

module.exports = router;
