const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SequenceSchema = new Schema({
  type: { type: String, required: true, unique: true, index: true, lowercase: true },
  prefix: { type: String, required: true, unique: true, uppercase: true },
  count: { type: Number, required: true, default: 1 },
  fill: { type: String, default: '0' },
  minLength: { type: Number, required: true, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('sequence', SequenceSchema);