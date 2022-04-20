const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  title: { type: String, required: true, lowercase: true, unique: true },
  couponCode: { type: String, required: true,  unique: true },
  isDeleted:{type:Boolean,default:false},
  startDate:{type:Date,required:true},
  endDate:{type:Date,required:true},
  freeShipping:{type:Boolean,default:false},
  quantity:{type:String},
  discountType:{type:String,required:true},
  status:{type:String,required:true},
  image:{type:Array},
  createdBy:{type: Schema.Types.ObjectId,ref:'user'},
  updatedBy:{type: Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})


const Coupon = mongoose.model('coupon',CouponSchema);
module.exports = Coupon;