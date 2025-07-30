'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Project extends Model {
        static associate(models) {
            Project.hasMany(models.Task, {
                foreignKey: 'project_id',
                as: 'tasks',
            });
        }
    }
    Project.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            worksection_id: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
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
            modelName: 'Project',
            tableName: 'projects',
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Project;
};