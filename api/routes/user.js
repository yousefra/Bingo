const express = require('express');
const router = express.Router();
const checkAdminAuth = require('../middleware/check-admin-auth');
const checkUserAuth = require('../middleware/check-user-auth');

const userController = require('../controllers/user');

router.get('/', checkAdminAuth, userController.getAllUsers);

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.delete('/:userId', checkAdminAuth, userController.deleteUser)

router.get('/isLoggedIn', checkUserAuth, userController.isLoggedIn)

router.get('/isAdminLoggedIn', checkAdminAuth, userController.isLoggedIn)

module.exports = router;