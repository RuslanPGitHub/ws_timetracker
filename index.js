require('dotenv').config();
require('./jobs/cronJobs.js');

const PORT = process.env.PORT || 3000;

const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

const router = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 : 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        },
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(router);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

if ("SOCKET" in process.env && process.env.SOCKET) {
    const socket = process.env.SOCKET;
    if (fs.existsSync(socket)) {
        fs.unlinkSync(socket);
    }
    app.listen(socket, () => {
        fs.chmodSync(socket, 0o660);
        console.log(`Express.js server is listening on socket ${socket}`);
    });
} else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
}

