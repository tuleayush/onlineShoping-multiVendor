const mongoose = require("mongoose");
const { ProductOptionVariantSchema } = require("./ProductOptionVariantSchema");

ProductOptionVariantSchema.index({ optionVariantIds: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('product_option_variant', ProductOptionVariantSchema);