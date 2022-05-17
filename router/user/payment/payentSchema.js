const joi = require("joi")
const Extension = require('joi-date-extensions');
const Joid = joi.extend(Extension);
const pattern = require("../../../utils/regex")
const paymentDetail = joi.object().keys({
    cardNo: joi.string().min(16).max(16).required().regex(pattern.cardNo),
    cardName: joi.string().required().regex(pattern.cardName).max(20).min(2),
    cardHolderName: joi.string().required().regex(pattern.cardHoldarName).max(30),
    cvvNo: joi.string().max(3).min(3).regex(pattern.cvvNo),
    expDate: Joid.date().format("MM/YY").greater('now'),
})
const updatePayment = joi.object().keys({
    cardNo: joi.string().min(16).max(16).regex(pattern.cvvNo),
    cardName: joi.string().regex(pattern.cardName).min(2).max(20),
    cardHolderName: joi.string().regex(pattern.cardHoldarName).max(30),
    cvvNo: joi.string().max(3).min(3).regex(pattern.cvvNo),
    expDate: Joid.date().format("MM/YY").greater('now'),
})

const id = joi.object().keys({
    id: joi.string().min(24).max(24)
})

const payment = joi.object().keys({
    orderId: joi.string().min(24).max(24).required(),
    paymentKey: joi.string().min(5).max(5).required(),
})


module.exports = {
    paymentDetail,
    updatePayment,
    id,
    payment
}