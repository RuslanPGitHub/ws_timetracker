const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
    showLogin(req, res) {
        res.render('Login', { error: null });
    },

    async login(req, res) {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.render('login', { error: 'Невірний логін або пароль' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.render('login', { error: 'Невірний логін або пароль' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        res.redirect('/');
    },

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    },
};
