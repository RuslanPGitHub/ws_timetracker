const express = require('express');

const { getSettingsHandler, postSettingsHandler } = require('../controllers/SettingsController');

const router = express.Router();

router.get('/', getSettingsHandler);
router.post('/', postSettingsHandler);

module.exports = router;
