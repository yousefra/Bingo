const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    createdDate: { type: Date, required: true }
});

module.exports = mongoose.model('Category', categorySchema);
