'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tasks', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            project_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'projects',
                    key: 'id',
                },
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now'),
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tasks');
    },
};
