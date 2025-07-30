'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Task.belongsTo(models.Project, {
                foreignKey: 'project_id',
                as: 'project',
            });
            Task.hasMany(models.TrackedHour, {
                foreignKey: 'task_id',
                as: 'trackedHours',
            });
        }
    }
    Task.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            project_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            worksection_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Task',
            tableName: 'tasks',
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Task;
};
