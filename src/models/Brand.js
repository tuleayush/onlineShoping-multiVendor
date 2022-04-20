const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

module.exports = mongoose.model('brand', BrandSchema, 'brand');