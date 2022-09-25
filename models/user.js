const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    desc: String,
    category:String,
    email: String,
    location: String,
    password: String 
})

module.exports = new mongoose.model('User', userSchema);