const jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt');

const User = require('mongoose').model('User');

//token handling middleware
// exports.createToken = function (auth) {
//     return 
// };

exports.generateToken = function (req, res, next) {
    req.token = jwt.sign({ userId: req.auth.id }, process.env.JWT_KEY, { expiresIn: 60 * 120 });
    next();
};

exports.sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
};

exports.authenticate = expressJwt({
    secret: process.env.JWT_KEY,
    requestProperty: 'auth',
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

exports.getCurrentUser = function (req, res, next) {
    User.findById(req.auth.id, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

exports.getOne = function (req, res) {
    var user = req.user.toObject();

    delete user['facebookProvider'];
    delete user['__v'];

    res.json(user);
};