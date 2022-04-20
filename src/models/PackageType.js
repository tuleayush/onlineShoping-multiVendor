const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeatureSchmea = new Schema({
    title: { type: String, trim: true, required: true }, // eg- Add Product , Live audience raffle calling etc.
    description: { type: String, trim: true},
});

const ServiceSchema = new Schema({
    title: { type: String, trim: true, required: true }, // eg- Dedicated Customer Support , Seller resource support etc.
    description:{ type: String, trim: true},
});

const PackageTypeSchema = new Schema({
    packageName: { type: String, trim: true, required: true }, // eg- MarketPlace or Enterprise.
    features: { type: [FeatureSchmea] },
    services: { type: [ServiceSchema] },

    //Need to add price

    isActive: { type: Boolean, default:false }, 
});
  

  
  const Package = mongoose.model("package", PackageTypeSchema);
  module.exports = Package;