'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DiscordNotification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    DiscordNotification.init(
        {
            developer_id: DataTypes.UUID,
            message: DataTypes.TEXT,
            sent_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'DiscordNotification',
            tableName: 'discord_notifications',
            freezeTableName: true,
        }
    );
    return DiscordNotification;
};
