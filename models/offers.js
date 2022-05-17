const mongoose = require('mongoose');
const { isDelete } = require('../router/admin/product/productSchema');
const Schema = mongoose.Schema;
const offerSchema = new Schema({
    subCategoryId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Offer = mongoose.model("offer", offerSchema)

module.exports = { Offer }