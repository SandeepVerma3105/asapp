const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const paymentSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    cardName: {
        type: String,
        required: true
    },

    cardNo: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    cvvNo: {
        type: Number,
        required: true,

    },
    expDate: {
        type: String,
        required: true
    },
    paymentKey: {
        type: Number,
        required: true,
        unique: true
    }
})

const Payment = mongoose.model("card", paymentSchema)



module.exports = {
    Payment
}