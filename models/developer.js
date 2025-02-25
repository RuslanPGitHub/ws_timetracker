'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Developer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Developer.hasMany(models.TrackedHour, {
                foreignKey: 'developer_id',
            });
            Developer.hasMany(models.DiscordNotification, {
                foreignKey: 'developer_id',
            });
        }
    }
    Developer.init(
        {
            worksection_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            discord_id: DataTypes.STRING,
            created_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Developer',
            tableName: 'developers',
            freezeTableName: true,
        }
    );
    return Developer;
};
