const { postToApi } = require('../core/apiClient');
const db = require('../models');
const { Op } = require('sequelize');
const { pagination } = require('../configs/config');

const getDevelopersHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = pagination.default_limit;
        const offset = (page - 1) * limit;

        const { count, rows: developers } = await db.Developer.findAndCountAll({
            offset,
            limit,
            order: [['ws_name', 'ASC']]
        });

        const pageCount = Math.ceil(count / limit);

        res.render('DevelopersView', {
            developers: developers,
            message: undefined,
            error: undefined,
            pagination: {
                total: count,
                page,
                pageCount,
                limit
            },
            filters: {}
        });
    } catch (err) {
        console.error('Помилка завантаження розробників:', err);
        res.status(500).render('DevelopersView', {
            developers: [],
            message: undefined,
            error: 'Не вдалося завантажити розробників з БД!',
            pagination: null,
            filters: {}
        });
    }
};

const postDevelopersHandler = async (req, res) => {
    let developers = [];

    try {
        const response = await postToApi('get_users');
        const developersData = response.data;

        if (
            !developersData ||
            !Array.isArray(developersData) ||
            developersData.length === 0
        ) {
            developers = db.Developer
                ? await db.Developer.findAll().catch((e) => {
                      console.error(
                          'Помилка отримання даних з БД якщо порожні дані з Worksection:',
                          e
                      );
                      return [];
                  })
                : [];

            return res.status(200).render('DevelopersView', {
                developers: developers,
                message: undefined,
                error: 'Не вдалося отримати нові дані розробників з Worksection або дані порожні.',
                pagination: {
                    total: developers.length,
                    page: 1,
                    pageCount: 1,
                    limit: pagination.default_limit
                },
                filters: {}
            });
        }

        const upsertPromises = developersData.map(async (obj) => {
            try {
                return await db.Developer.upsert(
                    {
                        ws_id: obj.id,
                        ws_avatar: obj.avatar,
                        ws_name: obj.name,
                        ws_title: obj.title,
                        ws_email: obj.email,
                        ws_phone: obj.phone || '',
                        discord_id: obj.discord_id || 'empty_' + obj.id,
                    },
                    {
                        where: { ws_id: obj.id },
                        returning: false,
                    }
                );
            } catch (upsertErr) {
                console.error(
                    `Помилка під час збереження користувача ${obj.name} (ID: ${obj.id}):`,
                    upsertErr
                );
            }
        });

        await Promise.all(upsertPromises);

        const page = parseInt(req.query.page) || 1;
        const limit = pagination.default_limit;
        const offset = (page - 1) * limit;

        const { count, rows: updatedDevelopers } = await db.Developer.findAndCountAll({
            offset,
            limit,
            order: [['ws_name', 'ASC']]
        });
        const pageCount = Math.ceil(count / limit);

        return res.render('DevelopersView', {
            developers: updatedDevelopers,
            message: 'Список розробників успішно оновлено!',
            error: undefined,
            pagination: {
                total: count,
                page,
                pageCount,
                limit
            },
            filters: {}
        });
    } catch (err) {
        console.error(
            `Помилка під час обробки даних розробників: ${err.message}`
        );

        return res.status(500).render('DevelopersView', {
            developers: [],
            message: undefined,
            error: `Помилка при обробці даних розробників: ${err.message}`,
            pagination: null,
            filters: {}
        });
    }
};

module.exports = { getDevelopersHandler, postDevelopersHandler };