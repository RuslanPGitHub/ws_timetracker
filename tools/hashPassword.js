const bcrypt = require('bcrypt');

async function hashPassword(plainTextPassword) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainTextPassword, saltRounds);
    console.log('Хеш пароля:', hashed);
}

const password = process.argv[2];

if (!password) {
    console.log('Використання: node tools/hash-password.js <пароль>');
    process.exit(1);
}

hashPassword(password);
