const { postToApi } = require('../core/apiClient');
const db = require('../models');

const getDevelopersHandler = async (req, res) => {
    try {
        const developers = await db.Developer.findAll();
        res.render('DevelopersView', {
            developers: developers,
            message: undefined,
            error: undefined,
        });
    } catch (err) {
        res.status(500).render('DevelopersView', {
            developers: [],
            message: undefined,
            error: 'Не вдалося завантажити розробників з БД!',
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

            res.status(200).render('DevelopersView', {
                developers: developers,
                message: undefined,
                error: 'Не вдалося отримати нові дані розробників з Worksection або дані порожні.',
            });
        }

        const upsertPromises = developersData.map(async (obj) => {
            console.log(obj);
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

        developers = db.Developer
            ? await db.Developer.findAll().catch((e) => {
                  console.error(
                      'Помилка отримання даних з БД після успішного оновлення:',
                      e
                  );
                  return [];
              })
            : [];

        return res.render('DevelopersView', {
            developers: developers,
            message: 'Список розробників успішно оновлено!',
            error: undefined,
        });
    } catch (err) {
        console.error(
            `Помилка під час обробки даних розробників: ${err.message}`
        );

        return res.status(500).render('DevelopersView', {
            developers: [],
            message: undefined,
            error: `Помилка при обробці даних розробників: ${err.message}`,
        });
    }
};

module.exports = { getDevelopersHandler, postDevelopersHandler };
