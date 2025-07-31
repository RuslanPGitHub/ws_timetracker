const express = require('express');
const dashboardRouter = require('./DashboardRoute');
const developersRouter = require('./DevelopersRoute');
const settingsRouter = require('./SettingsRoute');
const authRouter = require('./AuthRoute');
const getRootHandler = require('../controllers/RootController');

const ensureAuthenticated = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/', authRouter);

router.use('/dashboard', ensureAuthenticated, dashboardRouter);
router.use('/developers', ensureAuthenticated, developersRouter);
router.use('/settings', ensureAuthenticated, settingsRouter);

router.use('/', ensureAuthenticated, getRootHandler);

module.exports = router;
