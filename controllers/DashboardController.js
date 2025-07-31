const db = require('../models');
const { Op } = require('sequelize');

const getDashboardHandler = async (req, res) => {
    try {
        const { username: developerId, project: projectId, date } = req.query;

        const whereClause = {};
        const taskWhereClause = {};

        const allDevelopers = await db.Developer.findAll({
            attributes: ['id', 'ws_name'],
            order: [['ws_name', 'ASC']]
        });
        
        const allProjects = await db.Project.findAll({
            attributes: ['id', 'name', 'worksection_id'],
            order: [['name', 'ASC']]
        });

        if (developerId) {
            const developerExists = allDevelopers.some(dev => dev.id === developerId);
            if (developerExists) {
                whereClause.developer_id = developerId;
            } else {
                return res.render('DashboardView', {
                    trackedHours: [],
                    allDevelopers,
                    allProjects,
                    message: undefined,
                    error: 'Не знайдено годин для вказаного розробника.',
                    filters: { username: developerId, project: projectId, date }
                });
            }
        }

        if (projectId) {
            const projectExists = allProjects.some(proj => proj.id === projectId);
            if (projectExists) {
                taskWhereClause.project_id = projectId;
            } else {
                return res.render('DashboardView', {
                    trackedHours: [],
                    allDevelopers,
                    allProjects,
                    message: undefined,
                    error: 'Не знайдено годин для вказаного проєкту.',
                    filters: { username: projectId, project: projectId, date }
                });
            }
        }

        if (date) {
            const selectedDateUTC = new Date(date + 'T00:00:00.000Z');

            if (isNaN(selectedDateUTC.getTime())) {
                console.warn('Некоректний формат дати:', date);
            } else {
                const startOfDay = selectedDateUTC;
                const endOfDay = new Date(selectedDateUTC);
                endOfDay.setDate(endOfDay.getDate() + 1);
                endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

                whereClause.date = {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                };
            }
        }

        const trackedHours = await db.TrackedHour.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Developer,
                    as: 'developer',
                    attributes: ['ws_name']
                },
                {
                    model: db.Task,
                    as: 'task',
                    attributes: ['name', 'project_id', 'worksection_url'],
                    where: taskWhereClause,
                    include: {
                        model: db.Project,
                        as: 'project',
                        attributes: ['name', 'worksection_id']
                    }
                }
            ],
            order: [['date', 'DESC']],
        });

        let totalHoursInMinutes = 0;
        trackedHours.forEach(th => {
            const decimalHours = th.hours;
            const hours = Math.floor(decimalHours);
            const minutes = Math.round((decimalHours - hours) * 60);

            totalHoursInMinutes += hours * 60 + minutes;
        });

        const totalHours = Math.floor(totalHoursInMinutes / 60);
        const totalMinutes = totalHoursInMinutes % 60;
        const formattedTotalTime = `${totalHours}:${totalMinutes < 10 ? '0' : ''}${totalMinutes}`;

        res.render('DashboardView', {
            trackedHours: trackedHours,
            totalTime: formattedTotalTime,
            message: undefined,
            error: undefined,
            allDevelopers,
            allProjects,
            filters: { username: developerId, project: projectId, date },
            worksectionUrl: process.env.WORKSECTION_BASE_URL
        });
    } catch (err) {
        console.error('Помилка завантаження відстежених годин:', err);
        res.status(500).render('DashboardView', {
            trackedHours: [],
            totalTime: '0:00',
            message: undefined,
            error: 'Не вдалося завантажити відстежені години з БД!',
            allDevelopers: [],
            allProjects: [],
            filters: { username: req.query.username, project: req.query.project, date: req.query.date }
        });
    }
};

module.exports = { getDashboardHandler };