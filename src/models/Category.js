const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  brandId: [{ type: Schema.Types.ObjectId, required: true, ref: 'brand' }],
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

module.exports = mongoose.model('category', CategorySchema, 'category');