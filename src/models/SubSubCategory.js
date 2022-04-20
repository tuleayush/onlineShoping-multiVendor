const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubSubCategorySchema = new Schema({
  name: { type: String, required: true, unique: true,index:true },
  // storeId: { type: Schema.Types.ObjectId,ref:'store', required: true },
  catId: [{ type: Schema.Types.ObjectId,ref:'category', required: true }],
  subCatId: [{ type: Schema.Types.ObjectId,ref:'subcategory', required: true }],
  isDeleted:{type:Boolean,default:false},
  createdBy:{type: Schema.Types.ObjectId,ref:'user'},
  updatedBy:{type: Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})


const SubSubCategory = mongoose.model('subsubcategory',SubSubCategorySchema,'subsubcategory');
module.exports = SubSubCategory;