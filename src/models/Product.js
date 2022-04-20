const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ImageSchema } = require("./Image");
const { ApprovalStatus,DiscountType} = require("../utilities/constants/product");

const PriceSchema = new Schema({
  discountPricePercent: { type: Number, required: true, default: 0 },               // Actual Discounted Price
  discountType: { type: String, required: true, enum: Object.values(DiscountType), default: DiscountType.fixed }
});

const ProductSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true, index: true, uppercase: true },
  skuCode: { type: String, trim: true, default: '', uppercase: true },
  name: { type: String, required: true, trim: true ,index:true },
  description: { type: String, trim: true },
  images: { type: [ImageSchema] },
  catId: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  subCatId: { type: Schema.Types.ObjectId, ref: 'subcategory', required: true },
  subSubCatId: { type: Schema.Types.ObjectId, ref:'subsubcategory', },
  // subSubCatId: { type: String, default: null},
  brandId: { type: Schema.Types.ObjectId, ref: 'brand', required: true },
  shipId: { type: Schema.Types.ObjectId, ref: 'shipment', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false },
  approvalStatus: { type: String, default: ApprovalStatus.pending },
  price: { type: PriceSchema, required: true },
},{timestamps:true});



const Product = mongoose.model('product',ProductSchema);
module.exports = Product;