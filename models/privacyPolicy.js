const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const privacyPolicySchema = new Schema({
    title: {
        type: String
    },
    privacyPolicy: {
        type: String
    }
}, { timestamps: true });

const PrivacyPolicy = mongoose.model("privacyPolicy", privacyPolicySchema)

module.exports = { PrivacyPolicy }