'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Project extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Project.hasMany(models.Task, { foreignKey: 'project_id' });
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
            imestamps: false,
        }
    );
    return Project;
};
