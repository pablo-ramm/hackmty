const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    passwords: String 
})

module.exports = new mongoose.model('User', userSchema);