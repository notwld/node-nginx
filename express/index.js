
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'saladthecato',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/login', (req, res) => {
    const username = Math.random().toString(36).substring(7);
    const password = Math.random().toString(36).substring(7);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = {
        username,
        password: hash
    };

    console.log(`user: ${user.username} created with password: ${password}`);

    const token = jwt.sign(user, 'saladthecato');

    req.session.user = user;
    req.session.token = token;

    res.json({ message: "logged in!", token });
});

app.get('/profile', (req, res) => {
    const { token } = req.session || req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, 'saladthecato');
        res.json(decoded);
    } catch (err) {
        res.status(400).json({ message: 'bad request' });
    }
});

app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.json({ message: 'logged out' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
