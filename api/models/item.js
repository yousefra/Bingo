const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    backColor: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    createdDate: { type: Date, required: true }
});

module.exports = mongoose.model('Item', itemSchema);
