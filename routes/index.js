const express = require('express');

const dashboardRouter = require('./DashboardRoute');
const developersRouter = require('./DevelopersRoute');
const settingsRouter = require('./SettingsRoute');

const router = express.Router();

router.use('/dashboard/', dashboardRouter);
router.use('/developers/', developersRouter);
router.use('/settings/', settingsRouter);

router.use('/', (req, res) => {
    res.render('RootView', {});
});

module.exports = router;
