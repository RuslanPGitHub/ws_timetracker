const db = require('../models');
const { Op } = require('sequelize');

const { pagination } = require('../configs/config');

const getDashboardHandler = async (req, res) => {
    try {
        const safe = val => val && val !== 'undefined' ? val : '';

        const developerId = safe(req.query.username);
        const projectId = safe(req.query.project);
        const date = safe(req.query.date);
        const page = parseInt(req.query.page) || 1;
        const limit = pagination.default_limit;
        const offset = (page - 1) * limit;

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
            const developerExists = allDevelopers.some(dev => String(dev.id) === developerId);
            if (developerExists) {
                whereClause.developer_id = developerId;
            } else {
                return res.render('DashboardView', {
                    trackedHours: [],
                    totalTime: '0:00',
                    allDevelopers,
                    allProjects,
                    message: undefined,
                    error: 'Не знайдено годин для вказаного розробника.',
                    filters: { username: developerId, project: projectId, date },
                    pagination: null,
                    worksectionUrl: process.env.WORKSECTION_BASE_URL
                });
            }
        }

        if (projectId) {
            const projectExists = allProjects.some(proj => String(proj.id) === projectId);
            if (projectExists) {
                taskWhereClause.project_id = projectId;
            } else {
                return res.render('DashboardView', {
                    trackedHours: [],
                    totalTime: '0:00',
                    allDevelopers,
                    allProjects,
                    message: undefined,
                    error: 'Не знайдено годин для вказаного проєкту.',
                    filters: { username: developerId, project: projectId, date },
                    pagination: null,
                    worksectionUrl: process.env.WORKSECTION_BASE_URL
                });
            }
        }

        if (date) {
            const selectedDateUTC = new Date(date + 'T00:00:00.000Z');
            if (!isNaN(selectedDateUTC.getTime())) {
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

        const count = await db.TrackedHour.count({
            where: whereClause,
            include: [{
                model: db.Task,
                as: 'task',
                where: taskWhereClause
            }]
        });

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
            limit,
            offset
        });

        let totalMinutes = 0;
        trackedHours.forEach(th => {
            const hours = Math.floor(th.hours);
            const minutes = Math.round((th.hours - hours) * 60);
            totalMinutes += hours * 60 + minutes;
        });

        const totalHours = Math.floor(totalMinutes / 60);
        const remainderMinutes = totalMinutes % 60;
        const formattedTotalTime = `${totalHours}:${remainderMinutes < 10 ? '0' : ''}${remainderMinutes}`;

        const pageCount = Math.ceil(count / limit);

        res.render('DashboardView', {
            trackedHours,
            totalTime: formattedTotalTime,
            message: undefined,
            error: undefined,
            allDevelopers,
            allProjects,
            filters: { username: developerId, project: projectId, date },
            pagination: {
                total: count,
                page,
                pageCount,
                limit
            },
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
            filters: { username: '', project: '', date: '' },
            pagination: null,
            worksectionUrl: process.env.WORKSECTION_BASE_URL
        });
    }
};

module.exports = { getDashboardHandler };
