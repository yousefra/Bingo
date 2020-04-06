'use strict';

const passport = require('passport'),
    FacebookTokenStrategy = require('passport-facebook-token');

const User = require('mongoose').model('User');

module.exports = function () {

    passport.use(new FacebookTokenStrategy({
        clientID: '241361353662529',
        clientSecret: 'b12d3de6a69efc709a221a7f758de76f'
    },
        function (accessToken, refreshToken, profile, done) {
            User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
                return done(err, user);
            });
        }));
};