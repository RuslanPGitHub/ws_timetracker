const { postToApi } = require('../core/apiClient');
const db = require('../models');

const getDevelopersHandler = (req, res) => {
    res.render('DevelopersView', {});
};

const postDevelopersHandler = async (req, res) => {
    try {
        const data = await postToApi('get_users');
        res.json(data);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to get users',
            details: err.message,
        });
    }
};

module.exports = { getDevelopersHandler, postDevelopersHandler };
