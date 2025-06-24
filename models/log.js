'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Log extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Log.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            scan_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            developers_checked: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            errors: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Log',
            tableName: 'logs',
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Log;
};