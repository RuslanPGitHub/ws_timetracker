const express = require('express');

const { getDashboardHandler } = require('../controllers/DashboardController');

const router = express.Router();

router.get('/', getDashboardHandler);

module.exports = router;
