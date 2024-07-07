const mongoose = require('mongoose');

const User = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: { type: String },
    verified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model('User', User);