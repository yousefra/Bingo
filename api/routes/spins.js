const express = require('express');
const router = express.Router();
const checkUserAuth = require('../middleware/check-user-auth');

const spinsController = require('../controllers/spins');

router.get('/', checkUserAuth, spinsController.getAllUserSpins);

router.post('/', checkUserAuth, spinsController.addSpin);

router.patch('/:spinId', checkUserAuth, spinsController.sendGift);

module.exports = router;