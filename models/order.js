const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
    },
    deliveringTo: {
        type: String,
        required: true
    },
    row: {
        type: String,
        required: true
    },
    seatNo: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        default: "PENDING"
    },
    paymentType: {
        type: String,
    },
    transectionStatus: {
        type: String,
        enum: ["PAID", "UNPAID"],
        default: "UNPAID"
    },
    transectionId: {
        type: String
    },
    totalAmount: {
        type: Number
    },
    SurCharge: {
        type: Number
    },
    couponCode: {
        type: String
    },
    total: {
        type: Number,
    },
    grandTotal: {
        type: Number
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId
        },
        productName: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        totalAmount: {
            type: Number
        }
    }]
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema)

module.exports = { Order }