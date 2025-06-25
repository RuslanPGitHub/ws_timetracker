'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('developers', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            ws_avatar: {
                type: Sequelize.STRING,
                allowNull: true, // Assuming avatar is optional
            },
            ws_id: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
            },
            ws_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ws_title: {
                type: Sequelize.STRING,
                allowNull: true, // Assuming title is optional
            },
            ws_email: {
                type: Sequelize.STRING,
                allowNull: true, // Assuming email is optional
            },
            ws_phone: {
                type: Sequelize.STRING,
                allowNull: true, // Assuming phone is optional
            },
            discord_id: {
                type: Sequelize.STRING,
                unique: true, // Added unique constraint as per new schema
                allowNull: false, // Changed to not null as per new schema
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now'),
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('developers');
    },
};
