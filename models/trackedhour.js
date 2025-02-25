'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackedHour extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            TrackedHour.belongsTo(models.Developer, {
                foreignKey: 'developer_id',
            });
            TrackedHour.belongsTo(models.Task, { foreignKey: 'task_id' });
        }
    }
    TrackedHour.init(
        {
            developer_id: DataTypes.UUID,
            task_id: DataTypes.UUID,
            date: DataTypes.DATE,
            hours: DataTypes.FLOAT,
            created_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'TrackedHour',
            tableName: 'tracked_hours',
            freezeTableName: true,
        }
    );
    return TrackedHour;
};
