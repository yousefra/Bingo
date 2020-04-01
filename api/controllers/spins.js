const Spin = require('../models/spin');
const User = require('../models/user');

exports.addSpin = (req, res, next) => {
    const spin = new Spin({
        user: req.userData.userId,
        itemName: req.body.itemName,
        itemImage: req.body.itemImage,
        itemCategory: req.body.itemCategory,
        giftFrom: 0,
        date: new Date()
    });
    spin.save()
        .then(result => {
            res.status(201).json({
                message: 'Spin added'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.sendGift = (req, res, next) => {
    const spinId = req.params.spinId;
    const userId = req.body.userId;
    const updateOps = {
        "user": userId,
        "giftFrom": req.userData.userId
    };
    User.findById(userId)
        .select('username')
        .then(doc => {
            if (!doc) {
                res.status(404).json({
                    message: 'User not found!'
                });
            }
            return Spin.updateOne({ _id: spinId }, { $set: updateOps });
        })
        .then(result => {
            res.status(200).json({
                message: 'Gift sent successfully!'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.getAllUserSpins = (req, res, next) => {
    const id = req.userData.userId;
    Spin.find({ user: id })
        .then(spins => {
            res.status(200).json({
                count: spins.length,
                spins: spins
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};