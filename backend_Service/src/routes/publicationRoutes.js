const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');

router.get('/lookup-doi', publicationController.lookupDoi);
router.post('/lookup-doi', publicationController.lookupDoi);

router.get('/lookup-orcid', publicationController.lookupOrcid);
router.post('/lookup-orcid', publicationController.lookupOrcid);

module.exports = router;

