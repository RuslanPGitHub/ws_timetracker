const db = require('../models');

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

        res.render('RootView', {
            error: false,
            data: {
                countDevelopers,
                countProjects,
                countTasks,
                formattedProjectHours,
                formattedTotalTime,
            },
        });
    } catch (err) {
        res.render('RootView', {
            error: true,
            data: 'Помилка в getRootHandler: ' + err,
        });
    }
};

module.exports = getRootHandler;
