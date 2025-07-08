const cron = require('node-cron');
const { fetchTrackedHours } = require('./syncTrackedHours.js');

cron.schedule('0 9 * * *', async () => {
  console.log('Старт синхронізації затреканого часу...');
  await fetchTrackedHours();
});

// Тестовий запуск синхронізації
// (async () => {
//     console.log('Тестовий запуск синхронізації затреканого часу...');
//     await fetchTrackedHours();
// })();