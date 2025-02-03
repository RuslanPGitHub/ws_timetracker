const express = require('express');

const rootRouter = require('./RootRoute');

const router = express.Router();

router.use('/', rootRouter);

module.exports = router;
