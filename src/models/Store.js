const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ImageProviders } = require("../utilities/constants/image");

const ImageSchema = new Schema({
  url: { type: String, trim: true, required: true },
  provider: { type: String, required: true, default: ImageProviders.fileSystem, enum: Object.values(ImageProviders) },
  order: { type: Number, default: 1 }
});

const StoreSchema = new Schema({
  catId: { type: Array, required: true,ref:'category' },
  storeName: { type: String, required: true },
  description: { type: String },
  images: { type: [ImageSchema] },
  // addressLine1: { type: String, required: true },
  // city: { type: String, required: true },
  // country: { type: String, required: true },
  // state: { type: String, required: true },
  // pincode: { type: String, required: true },
  // website: { type: String },
  // isRegistered: { type: Boolean, required: true,default:false },
  isDeleted:{type:Boolean,default:false},
  createdBy:{type: Schema.Types.ObjectId,ref:'user'},
  updatedBy:{type: Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})


const Store = mongoose.model('store',StoreSchema);
module.exports = Store;