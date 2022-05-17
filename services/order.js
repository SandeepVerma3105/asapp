const { Cart } = require("../models/cart")
const { Order } = require("../models/order")
const { ObjectID } = require("BSON")

const placeOrder = async(model, data) => {
    console.log("===>>>", data)
    result = await Cart.aggregate([{
            $match: {
                $expr: {
                    $eq: ["$userId", ObjectID("6278ff908ce5589bada42362")]
                }
            },

        },

    ])
    console.log("jbjhdjs", result)
    return result[0].products
}

module.exports = {
    placeOrder
}