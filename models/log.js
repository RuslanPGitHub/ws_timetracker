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
            scan_date: DataTypes.DATE,
            developers_checked: DataTypes.INTEGER,
            errors: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Log',
            tableName: 'logs',
            freezeTableName: true,
        }
    );
    return Log;
};
