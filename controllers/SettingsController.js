const db = require('../models');

const getSettingsHandler = async (req, res) => {
    try {
        const allSettings = await db.Setting.findAll();
        const settingsMap = {};
        allSettings.forEach(setting => {
            settingsMap[setting.key] = setting.value;
        });

        res.render('SettingsView', {
            settings: settingsMap,
            message: undefined,
            error: undefined
        });
    } catch (err) {
        res.status(500).render('SettingsView', {
            settings: {},
            message: undefined,
            error: 'Не вдалося завантажити налаштування: ' + err.message
        });
    }
};

const postSettingsHandler = async (req, res) => {
    try {
        //throw new Error('Імітація помилки!');

        const settingsToUpdate = req.body;

        for (const key in settingsToUpdate) {
            if (Object.hasOwnProperty.call(settingsToUpdate, key)) {
                const value = settingsToUpdate[key];

                await db.Setting.upsert({
                    key: key,
                    value: value
                }, {
                    where: { key: key },
                });
            }
        }

        const allSettings = await db.Setting.findAll();
        const settingsMap = {};
        allSettings.forEach(setting => {
            settingsMap[setting.key] = setting.value;
        });

        res.status(200).render('SettingsView', {
            message: 'Налаштування успішно збережено!',
            settings: settingsMap,
            error: undefined
        });

    } catch (err) {
        const allSettings = await db.Setting.findAll();
        const settingsMap = {};
        allSettings.forEach(setting => {
            settingsMap[setting.key] = setting.value;
        });

        res.status(500).render('SettingsView', {
            settings: settingsMap,
            message: undefined,
            error: 'Не вдалося зберегти налаштування: ' + err.message
        });
    }
};

module.exports = { getSettingsHandler, postSettingsHandler };