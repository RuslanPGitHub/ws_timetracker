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
            name: DataTypes.STRING,
            created_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Project',
            tableName: 'projects',
            freezeTableName: true,
        }
    );
    return Project;
};
