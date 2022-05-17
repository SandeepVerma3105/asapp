const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    discount: {
        type: String
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    isDisable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date
    },
    updateedAt: {
        type: Date
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

const Product = mongoose.model("product", productsSchema)

module.exports = { Product }