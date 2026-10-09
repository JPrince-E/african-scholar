const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleMiddleware');

// Public
router.get('/', sponsorController.getActiveSponsors);

// Admin
router.get('/all', authMiddleware, roleGuard(['SUPER_ADMIN']), sponsorController.getAllSponsors);
router.post('/', authMiddleware, roleGuard(['SUPER_ADMIN']), sponsorController.createSponsor);
router.put('/:id', authMiddleware, roleGuard(['SUPER_ADMIN']), sponsorController.updateSponsor);
router.delete('/:id', authMiddleware, roleGuard(['SUPER_ADMIN']), sponsorController.deleteSponsor);

module.exports = router;
