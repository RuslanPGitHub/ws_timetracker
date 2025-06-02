const express = require('express');

const { getSettingsHandler } = require('../controllers/SettingsController');

const router = express.Router();

router.get('/', getSettingsHandler);

module.exports = router;
