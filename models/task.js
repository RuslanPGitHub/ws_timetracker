'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Task.belongsTo(models.Project, { foreignKey: 'project_id' });
            Task.hasMany(models.TrackedHour, { foreignKey: 'task_id' });
        }
    }
    Task.init(
        {
            project_id: DataTypes.UUID,
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            created_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Task',
            tableName: 'tasks',
            freezeTableName: true,
        }
    );
    return Task;
};
