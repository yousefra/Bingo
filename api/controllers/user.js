const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getAllUsers = (req, res, next) => {
    User.find({ role: 2 })
        .then(users => {
            const oldUsers = users.filter(user => {
                const date = user.toObject().createdDate.split('T')[0];
                return new Date(new Date(date).toDateString()) < new Date(new Date().toDateString());
            }).length;
            const currentUsers = users.length;
            const percent = Math.round(((currentUsers - oldUsers) / oldUsers) * 100);
            res.status(200).json({
                count: currentUsers,
                users: users,
                percent: percent
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
};

exports.signup = (req, res, next) => {
    User.find({ username: req.body.username })
        .then(result => {
            if (result.length >= 1) {
                res.status(409).json({
                    message: 'Username already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            username: req.body.username,
                            password: hash,
                            role: 1 // Admin
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.json(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        });
};

exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            console.log(req.body.username, req.body.password)
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.log('found')
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        username: user.username,
                        userId: user._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1w"
                    })
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.isLoggedIn = (req, res, next) => {
    res.status(200).json({
        message: 'User is logged in'
    });
}