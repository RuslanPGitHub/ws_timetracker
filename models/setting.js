'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Setting extends Model {
        static associate(models) {
            // define association here
        }
    }
    Setting.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            key: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Setting',
            tableName: 'settings',
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
    return Setting;
};
