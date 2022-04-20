const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  isDeleted:{type:Boolean,default:false},
  createdBy:{type: Schema.Types.ObjectId,ref:'user'},
  updatedBy:{type: Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})


const Offer = mongoose.model('offer',OfferSchema);
module.exports = Offer;