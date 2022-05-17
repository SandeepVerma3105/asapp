const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FAQSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    question: {
        type: String
    },
    answer: [{
        type: String
    }]
}, { timestamps: true });

const FAQ = mongoose.model("FAQ", FAQSchema)

module.exports = { FAQ }