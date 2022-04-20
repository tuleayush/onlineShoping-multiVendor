const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const influencersSchema = new Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  primarySocialMedia:{type:String},  
  secondarySocialMedia:{type:String},
  primaryCategory:{type:String},
  secondarycategory:{type:String},
  aboutUs:{type:String},
  instagramUsername:{type:String},
  isDeleted:{type:Boolean,default:false},
  createdBy:{type: Schema.Types.ObjectId,ref:'user'},
  updatedBy:{type: Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})


const Influencers = mongoose.model('influencers',influencersSchema);
module.exports = Influencers;