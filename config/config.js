require('dotenv').config();

module.exports = {
    development: {
        use_env_variable: 'DATABAASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
