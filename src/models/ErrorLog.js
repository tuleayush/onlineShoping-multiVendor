const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorLogSchema = new Schema({
    success: { type: Boolean, default: false },
    message: String,
    error: Object
}, { timestamps: true });

module.exports = mongoose.model('errorlog', ErrorLogSchema);