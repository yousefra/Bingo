'use strict';

const passport = require('passport'),
    FacebookTokenStrategy = require('passport-facebook-token');

const userController = require('../controllers/user');

module.exports = function () {

    passport.use(new FacebookTokenStrategy({
        clientID: '241361353662529',
        clientSecret: 'b12d3de6a69efc709a221a7f758de76f'
    },
        function (accessToken, refreshToken, profile, done) {
            userController.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
                return done(err, user);
            });
        }));
};