require('dotenv').config();

const axios = require('axios');
const crypto = require('crypto-js');

const config = {
    account_url: process.env.WORKSECTION_BASE_URL,
    api: process.env.WORKSECTION_API_KEY,
};

/**
 * Створює hash і повертає підписаний URL
 */
function buildSignedUrl(action, params = {}) {
    const baseUrl = `${config.account_url}/api/admin/v2`;

    const query = { action, ...params };
    const queryString = Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

    const hash = crypto.MD5(queryString + config.api).toString();

    return `${baseUrl}?${queryString}&hash=${hash}`;
}

/**
 * Відправляє POST-запит з підписаним хешем
 */
async function postToApi(action, params = {}) {
    const url = buildSignedUrl(action, params);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const response = await axios.post(url, null, { headers });
        return response.data;
    } catch (err) {
        console.error('API error:', err.response?.data || err.message);
        throw err;
    }
}

module.exports = { postToApi };
