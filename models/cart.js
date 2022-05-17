const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    deliveringTo: {
        type: String
    },
    enterSala: {
        type: String
    },
    row: {
        type: String
    },
    seatNo: {
        type: String
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "subCategory"
        },

        totalAmount: {
            type: Number
        }
    }, ]
}, { timestamps: true });

const Cart = mongoose.model("cart", cartSchema)

module.exports = { Cart }