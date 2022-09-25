const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCommunity = new Schema({
    name: String,
    members: Number,
    location: String 
})

module.exports = new mongoose.model('Community', productSchema);