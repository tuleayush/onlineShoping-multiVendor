const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ImageProviders } = require("../utilities/constants/image");

module.exports = {
  ImageSchema: new Schema({
    url: { type: String, trim: true, required: true },
    provider: { type: String, required: true, default: ImageProviders.cloud, enum: Object.values(ImageProviders) },
    order: { type: Number, default: 1 }
  })
};