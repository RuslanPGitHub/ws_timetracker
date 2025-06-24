const express = require('express');

const {
    getDevelopersHandler,
    postDevelopersHandler,
} = require('../controllers/DevelopersController');

const router = express.Router();

router.get('/', getDevelopersHandler);
router.post('/', postDevelopersHandler);

module.exports = router;
