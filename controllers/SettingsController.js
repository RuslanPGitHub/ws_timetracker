const getSettingsHandler = (req, res) => {
    res.render('SettingsView', {});
};

const postSettingsHandler = (req, res) => {
    res.json(req.body);
};

module.exports = { getSettingsHandler, postSettingsHandler };
