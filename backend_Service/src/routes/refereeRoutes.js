const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

// Public referee endorsement endpoints
router.get('/endorse/:token', refereeController.getEndorsementByToken);
router.post('/endorse/:token', refereeController.submitEndorsement);

// Application referee management
router.post('/application/:applicationId/invite', refereeController.inviteReferee);
router.get('/application/:applicationId', refereeController.getApplicationReferees);

module.exports = router;
