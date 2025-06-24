'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // tracked_hours -> developers
        await queryInterface.addConstraint('tracked_hours', {
            fields: ['developer_id'],
            type: 'foreign key',
            name: 'fk_tracked_hours_developer',
            references: {
                table: 'developers',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // tracked_hours -> tasks
        await queryInterface.addConstraint('tracked_hours', {
            fields: ['task_id'],
            type: 'foreign key',
            name: 'fk_tracked_hours_task',
            references: {
                table: 'tasks',
                field: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });

        // tasks -> projects
        await queryInterface.addConstraint('tasks', {
            fields: ['project_id'],
            type: 'foreign key',
            name: 'fk_tasks_project',
            references: {
                table: 'projects',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // discord_notifications -> developers
        await queryInterface.addConstraint('discord_notifications', {
            fields: ['developer_id'],
            type: 'foreign key',
            name: 'fk_discord_notifications_developer',
            references: {
                table: 'developers',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'tracked_hours',
            'fk_tracked_hours_developer'
        );
        await queryInterface.removeConstraint(
            'tracked_hours',
            'fk_tracked_hours_task'
        );
        await queryInterface.removeConstraint('tasks', 'fk_tasks_project');
        await queryInterface.removeConstraint(
            'discord_notifications',
            'fk_discord_notifications_developer'
        );
    },
};
