const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
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
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    socialId: {
        type: String
    },
    socialToken: {
        type: String
    },
    isDelete: {
        type: Boolean
    }
}, { timestamps: true });

const User = mongoose.model("user", userSchema)

module.exports = { User }