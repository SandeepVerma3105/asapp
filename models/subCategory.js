const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subCategorySchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true });

const SubCategory = mongoose.model("subCategory", subCategorySchema)

module.exports = { SubCategory }