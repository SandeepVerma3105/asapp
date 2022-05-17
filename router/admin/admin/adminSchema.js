const joi = require("joi")
const pattern = require("../../../utils/regex")

const credeintial = joi.object().keys({
    email: joi.string().required().email().regex(pattern.email),
    password: joi.string().required().regex(pattern.password)
})
const privacyPolicy = joi.object().keys({
    title: joi.string().required().regex(pattern.title),
    privacyPolicy: joi.string().required().regex(pattern.description)
})
const termAndCondition = joi.object().keys({
    title: joi.string().required().regex(pattern.title),
    termAndCondition: joi.string().required().regex(pattern.description)
})



module.exports = {
    credeintial,
    privacyPolicy,
    termAndCondition
}