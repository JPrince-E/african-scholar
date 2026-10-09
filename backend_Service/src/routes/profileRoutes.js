const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public directory & filters
router.get('/directory', profileController.getPublicDirectory);
router.get('/filter-options', profileController.getFilterOptions);
router.get('/external-universities', profileController.getExternalUniversities);
router.get('/:id', profileController.getScholarById);

// Protected routes (Scholar profile management)
router.get('/me/profile', authMiddleware, profileController.getMyProfile);
router.post('/me/profile', authMiddleware, profileController.upsertProfile);
router.put('/me/profile', authMiddleware, profileController.upsertProfile);

module.exports = router;
