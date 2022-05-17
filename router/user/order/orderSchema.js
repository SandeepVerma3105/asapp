const joi = require("joi")
const pattern = require("../../../utils/regex.js")


const placeOrder = joi.object().keys({
    couponCode: joi.string().regex(pattern.coupon),
    paymentType: joi.string().regex(pattern.paymentType)
})

const updateDetail = joi.object().keys({
    orderId: joi.string().min(24).max(24),
    firstName: joi.string().regex(pattern.name),
    lastName: joi.string().regex(pattern.name),
})

module.exports = {
    placeOrder,
    updateDetail
}