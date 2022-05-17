const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const termAndConditionSchema = new Schema({
    title: {
        type: String
    },
    termAndCondition: {
        type: String
    }
}, { timestamps: true });

const TermAndCondition = mongoose.model("termAndCondition", termAndConditionSchema)

module.exports = { TermAndCondition }