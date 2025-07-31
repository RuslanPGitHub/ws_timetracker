const db = require('../models');
const { Op } = require('sequelize');

const getRootHandler = async (req, res) => {
    try {
        const countDevelopers = await db.Developer.count();
        const countProjects = await db.Project.count();
        const countTasks = await db.Task.count();

        const projectTrackedHours = await db.TrackedHour.findAll({
            attributes: [
                [
                    db.sequelize.fn(
                        'SUM',
                        db.sequelize.col('TrackedHour.hours')
                    ),
                    'totalHoursDecimal',
                ],
            ],
            include: [
                {
                    model: db.Task,
                    as: 'task',
                    attributes: [],
                    include: [
                        {
                            model: db.Project,
                            as: 'project',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ],
            group: ['task.project.id', 'task.project.name'],
            raw: true,
        });

        const formattedProjectHours = projectTrackedHours.map((projectData) => {
            const decimalHours = projectData.totalHoursDecimal;
            const hours = Math.floor(decimalHours);
            const minutes = Math.round((decimalHours - hours) * 60);
            return {
                projectName: projectData['task.project.name'],
                totalTime: `${hours}:${minutes < 10 ? '0' : ''}${minutes}`,
            };
        });

        const trackedHours = await db.TrackedHour.findAll();

        let totalHoursInMinutes = 0;
        
        trackedHours.forEach((th) => {
            const decimalHours = th.hours;
            const hours = Math.floor(decimalHours);
            const minutes = Math.round((decimalHours - hours) * 60);
            totalHoursInMinutes += hours * 60 + minutes;
        });

        const totalHours = Math.floor(totalHoursInMinutes / 60);
        const totalMinutes = totalHoursInMinutes % 60;
        const formattedTotalTime = `${totalHours}:${
            totalMinutes < 10 ? '0' : ''
        }${totalMinutes}`;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const developerHours = await db.TrackedHour.findAll({
            where: {
                created_at: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
            attributes: [
                [
                    db.sequelize.fn(
                        'SUM',
                        db.sequelize.col('TrackedHour.hours')
                    ),
                    'totalDeveloperHours',
                ],
            ],
            include: [
                {
                    model: db.Developer,
                    as: 'developer',
                    attributes: ['id', 'ws_name'], 
                },
            ],
            group: ['developer.id', 'developer.ws_name'], 
            raw: true,
        });

        const formattedDeveloperHours = developerHours.map((devData) => {
            const decimalHours = parseFloat(devData.totalDeveloperHours);
            return {
                name: devData['developer.ws_name'], 
                hours: Math.round(decimalHours),
            };
        });

        formattedDeveloperHours.sort((a, b) => b.hours - a.hours);

        res.render('RootView', {
            error: false,
            data: {
                countDevelopers,
                countProjects,
                countTasks,
                formattedProjectHours,
                formattedTotalTime,
                developerHoursData: formattedDeveloperHours,
            },
        });
    } catch (err) {
        console.error('Помилка в getRootHandler:', err);
        res.render('RootView', {
            error: true,
            message: 'Виникла помилка під час завантаження даних: ' + err.message,
            data: {
                countDevelopers: 0,
                countProjects: 0,
                countTasks: 0,
                formattedProjectHours: [],
                formattedTotalTime: '0:00',
                developerHoursData: [],
            },
        });
    }
};

module.exports = getRootHandler;