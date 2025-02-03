const express = require('express');

const { getRootHandler } = require('../controllers/RootController');

const router = express.Router();

router.get('/', getRootHandler);

module.exports = router;
