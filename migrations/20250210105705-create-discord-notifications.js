'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('discord_notifications', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            developer_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'developers',
                    key: 'id',
                },
                allowNull: false,
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            sent_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now'),
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('discord_notifications');
    },
};
