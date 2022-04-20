const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");
const { ImageSchema } = require("./Image");

const SellerSchema = User.discriminator('seller', new Schema({
  storeName:{ type: String,required: true},
  businessAddress:{ type: String,default:''},
  accountNumber:{ type: String,default:''}, 
  bsb:{ type: String,default:''},
  accountName:{ type: String,default:''},
  storeLogoImage: { type: [ImageSchema] },
  storeHomeImage: { type: [ImageSchema] },
}));

const Seller = mongoose.model("seller");

module.exports = Seller;