const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/continental-stats', analyticsController.getContinentalStats);

module.exports = router;
