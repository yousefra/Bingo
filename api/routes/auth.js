const passport = require('passport');
const express = require('express');
const router = express.Router();

const facebookAuth = require('../middleware/facebookAuth');

router.post('/facebook', passport.authenticate('facebook-token', { session: false }), (req, res, next) => {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
        id: req.user.id
    };

    next();
}, facebookAuth.generateToken, facebookAuth.sendToken);

router.get('/me', facebookAuth.authenticate, facebookAuth.getCurrentUser, facebookAuth.getOne);

module.exports = router;