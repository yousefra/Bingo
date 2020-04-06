const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('useCreateIndex', true);

// Require the routes
const categoriesRoutes = require('./api/routes/categories');
const itemsRoutes = require('./api/routes/items');
const userRoutes = require('./api/routes/user');
const spinsRoutes = require('./api/routes/spins');
const authRoutes = require('./api/routes/auth');

const passportConfig = require('./api/middleware/passport');

//setup configuration for facebook login
passportConfig();

// MongoDB Connection
mongoose
    .connect(`mongodb+srv://bingo:${process.env.MONGO_ATLAS_PW}@bingo-v9d1s.mongodb.net/test?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(reason => {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });

app.use(morgan('dev'));
app.use('/itemsImages', express.static('itemsImages'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
    res.header('Access-Control-Expose-Headers', 'x-auth-token');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/categories', categoriesRoutes);
app.use('/items', itemsRoutes);
app.use('/user', userRoutes);
app.use('/spins', spinsRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;