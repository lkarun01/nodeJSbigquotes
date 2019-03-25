const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


// Load User Model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

// Load keys
const keys = require('./config/keys');

// Mongoose connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
            .then(() => {
                console.log('Mongo DB connected');
            })
            .catch(err => {
                console.log(err);
            });

const app = express();

app.get('/', (req, res) => {
    res.send('It works');
});

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
    req.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/auth', auth); 

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on por ${port}`);
});