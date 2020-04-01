const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spinSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemName: { type: String, required: true },
    itemImage: { type: String, required: true },
    itemCategory: { type: String, required: true },
    giftFrom: { type: Schema.Types.Mixed, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Spin', spinSchema);
