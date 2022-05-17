const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contectUsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true });

const ContectUs = mongoose.model("contectUs", contectUsSchema)

module.exports = { ContectUs }