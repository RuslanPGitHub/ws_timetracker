'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackedHour extends Model {
        static associate(models) {
            TrackedHour.belongsTo(models.Developer, {
                foreignKey: 'developer_id',
                as: 'developer',
            });
            TrackedHour.belongsTo(models.Task, {
                foreignKey: 'task_id',
                as: 'task',
            });
        }
    }
    TrackedHour.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            developer_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            task_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            hours: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'TrackedHour',
            tableName: 'tracked_hours',
            freezeTableName: true,
            timestamps: false,
        }
    );
    return TrackedHour;
};