require('dotenv').config();

const db = require('../models');
const { parseTimeToDecimal } = require('../tools/parseTime');
const { postToApi } = require('../core/apiClient');

function getYesterdayFormatted() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0].split('-').reverse().join('.');
}

async function fetchTrackedHours() {
    const date = getYesterdayFormatted();
    console.log(`Синхронізація за дату: ${date}`);

    try {
        const response = await postToApi('get_costs', {
            datestart: date,
            dateend: date,
        });

        if (response.status !== 'ok') {
            console.error('Помилка від Worksection API:', response);
            return;
        }

        const data = response.data;
        console.log(`Отримано записів: ${data.length}`);

        for (const entry of data) {
            const userWS = entry.user_from;
            const taskWS = entry.task;
            const projectWS = taskWS.project;

            const [developer] = await db.Developer.findOrCreate({
                where: { ws_id: userWS.id },
                defaults: {
                    ws_id: userWS.id,
                    ws_name: userWS.name,
                    ws_email: userWS.email,
                    ws_avatar: null,
                },
            });

            const [project] = await db.Project.findOrCreate({
                where: { worksection_id: projectWS.id },
                defaults: {
                    name: projectWS.name,
                },
            });

            const [task] = await db.Task.findOrCreate({
                where: { worksection_url: taskWS.page },
                defaults: {
                    name: taskWS.name,
                    project_id: project.id,
                    description: taskWS.name,
                },
            });

            const hoursDecimal = parseTimeToDecimal(entry.time);

            await db.TrackedHour.create({
                developer_id: developer.id,
                task_id: task.id,
                date: entry.date,
                hours: hoursDecimal,
            });
        }

        console.log('Синхронізація завершена успішно.');
    } catch (error) {
        console.error('Помилка при синхронізації:', error.message);
    }
}

module.exports = { fetchTrackedHours };
