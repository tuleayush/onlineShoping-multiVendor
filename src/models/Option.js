const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
  type: { type: String, required: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  order: { type: Number, required: true, default: 1 },
  subCatId: { type: Schema.Types.ObjectId, ref: 'sub_category' },     // optional
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('option', OptionSchema);