const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');

router.post('/application/:applicationId', juryController.submitJuryReview);
router.get('/application/:applicationId', juryController.getApplicationJuryReviews);

module.exports = router;
