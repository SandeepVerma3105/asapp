const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
}, { timestamps: true });

const Admin = mongoose.model("admin", adminSchema)

module.exports = { Admin }