const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, required: true},
  quantity:{type:String,required:true},
  status:{type:String,lowercase: true,default:'cart'},
  isDeleted:{type:Boolean,default:false},
  createdBy:{type: Schema.Types.ObjectId,ref:'user'},
  updatedBy:{type: Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})


const Cart = mongoose.model('cart',cartSchema);
module.exports = Cart;