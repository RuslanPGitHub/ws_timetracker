'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DiscordNotification extends Model {
        static associate(models) {
            DiscordNotification.belongsTo(models.Developer, {
                foreignKey: 'developer_id',
            });
        }
    }
    DiscordNotification.init(
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
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            sent_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'DiscordNotification',
            tableName: 'discord_notifications',
            freezeTableName: true,
            timestamps: false,
        }
    );
    return DiscordNotification;
};