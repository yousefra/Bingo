const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY, null);
        User.findOne({ username: decoded.username })
            .then(res => {
                const user = res.toObject();
                if (user.role == 1) {
                    req.userData = decoded;
                    next();
                } else {
                    return AuthFailed(res);
                }
            })
            .catch(error => {
                return AuthFailed(res);
            })
    } catch (error) {
        return AuthFailed(res);
    }
};

const AuthFailed = res => {
    return res.status(401).json({
        message: 'Auth failed'
    });
}