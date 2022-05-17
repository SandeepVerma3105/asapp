const { Product } = require("../models/product")

const productList = async(data, result) => {

    // if (data.categoryId) {
    //     cat = {
    //         $match: {
    //             $expr: {
    //                 $eq: ["$_id", "$$categoryId"]
    //             }
    //         }
    //     }
    // } else {
    //     cat = {
    //         $match: {
    //             $expr: {
    //                 $eq: ["$_id", "food"],
    //                 $eq: ["$_id", "drink"]
    //             }
    //         }
    //     }
    // }
    result = await Product.aggregate([

        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                pipeline: [
                    { $project: { _id: 1, name: 1 } },
                ],
                as: "category",
            }
        },

        {
            $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                pipeline: [
                    { $project: { _id: 1, name: 1 } },
                ],
                as: "subCategory"
            }
        },


        {
            $project: {
                _id: 1,
                name: 1,
                quantity: 1,
                price: 1,
                category: 1,
                subCategory: 1

            },
        },


    ])
    console.log(result)
    return result
}

module.exports = {
    productList
}