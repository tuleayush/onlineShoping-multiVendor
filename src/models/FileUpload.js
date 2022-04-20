const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ImageProviders } = require("../utilities/constants/image");

const FileUploadSchema = new Schema({
  // url: { type: String, trim: true, required: true },
  provider: { type: String, required: true, default: ImageProviders.fileSystem, enum: Object.values(ImageProviders) },
  api: { type: String, trim: true, required: true },
  file: { type: Object, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('upload', FileUploadSchema);