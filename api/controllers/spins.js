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
                message: 'Spin added',
                createdSpin: {
                    id: result._id,
                    user: result.user,
                    itemName: result.itemName,
                    itemImage: result.itemImage,
                    itemCategory: result.itemCategory,
                    giftFrom: result.giftFrom,
                    date: result.date
                }
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
    const email = req.body.email;
    User.findOne({ email: email })
        .select('_id')
        .then(doc => {
            if (!doc || doc._id === req.userData.userId) {
                res.status(404).json({
                    message: 'User not found!'
                });
            }
            const updateOps = {
                "user": doc._id,
                "giftFrom": req.userData.userId
            };
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

exports.getAllSpins = (req, res, next) => {
    Spin.find()
        .populate('user', 'name email')
        .then(spins => {
            const gifts = spins.filter(spin => spin.giftFrom != 0);

            // Calculate spins increase percent
            const oldSpins = spins.filter(spin => {
                const date = spin.date.toJSON().slice(0, 10);
                return new Date(new Date(date).toDateString()) < new Date(new Date().toDateString());
            }).length;
            const currentSpins = spins.length;
            let percent = null;
            if (oldSpins !== 0) {
                percent = Math.round(((currentSpins - oldSpins) / oldSpins) * 100);
            } else {
                percent = currentSpins * 100;
            }

            // Calculate gifts increase percent
            const oldGifts = gifts.filter(gift => {
                const date = gift.date.toJSON().slice(0, 10);
                return new Date(new Date(date).toDateString()) < new Date(new Date().toDateString());
            }).length;
            const giftsCount = gifts.length;
            let giftsPercent = null;
            if (oldSpins !== 0) {
                giftsPercent = Math.round(((giftsCount - oldGifts) / oldGifts) * 100);
            } else {
                giftsPercent = giftsCount * 100;
            }
            res.status(200).json({
                count: currentSpins,
                spins: spins,
                percent: percent,
                giftsCount: giftsCount,
                giftsPercent: giftsPercent
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}