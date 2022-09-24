const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    quantity: Number,
    location: String 
})

module.exports = new mongoose.model('Product', productSchema);