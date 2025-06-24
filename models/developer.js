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
            discord_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
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
            modelName: 'Developer',
            tableName: 'developers',
            freezeTableName: true,
            timestamps: false, 
        }
    );
    return Developer;
};