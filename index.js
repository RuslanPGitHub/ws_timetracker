require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const path = require('path');

const router = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);


app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
