const mongoose = require('mongoose');

const Contact = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: Number },
    address: { type: String },
    userId: { type: String }
}, {timestamps: true})

module.exports = mongoose.model('Contact', Contact);