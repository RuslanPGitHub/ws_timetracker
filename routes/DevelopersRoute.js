const express = require('express');

const { getDevelopersHandler } = require('../controllers/DevelopersController');

const router = express.Router();

router.get('/', getDevelopersHandler);

module.exports = router;
