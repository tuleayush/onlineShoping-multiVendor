const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaticPageSchema = new Schema({
  title: { type: String, trim: '' },
  key: { type: String, required: true, lowercase: true, trim: '', unique: true },
  text: { type: String, trim: '', required: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('static_page', StaticPageSchema);
