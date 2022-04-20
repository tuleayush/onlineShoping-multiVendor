const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  actualPrice: { type: Number, required: true },                                    // Actual Show Price
});

const DetailSchmea = new Schema({
  title: String,
  description: String
});

const ProductOptionVariantSchema = new Schema({
  price: { type: PriceSchema, required: true },
  optionVariantIds: { type: [Schema.Types.ObjectId], ref: 'option_variant', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  details: { type: [DetailSchmea] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = {
  DetailSchmea,
  ProductOptionVariantSchema
};