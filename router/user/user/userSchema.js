const joi = require("joi")
const pattern = require("../../../utils/regex")
const signUp = joi.object().keys({
    firstName: joi.string().required().regex(pattern.name),
    lastName: joi.string().required().regex(pattern.name),
    email: joi.string().required().email().regex(pattern.email),
    phoneNumber: joi.string().required().regex(pattern.phoneNumber),
    password: joi.string().required().regex(pattern.password),
    confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
})

const updateProfile = joi.object().keys({
    firstName: joi.string().regex(pattern.name),
    lastName: joi.string().regex(pattern.name),
    email: joi.string().regex(pattern.email),
    phoneNumber: joi.string().regex(pattern.phoneNumber)
})

const logIn = joi.object().keys({
    email: joi.string().required().email().regex(pattern.email),
    password: joi.string().required().regex(pattern.password)
})

const changePasswod = joi.object().keys({
    oldPassword: joi.string().required().regex(pattern.password),
    password: joi.string().required().regex(pattern.password),
    confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
})

const resetPassword = joi.object().keys({
    email: joi.string().required().email().regex(pattern.email)
})

const createCart = joi.object().keys({
    deliveringTo: joi.string().required(),
    enterSala: joi.number().required(),
    row: joi.number().required(),
    seat: joi.string().required(),
})
const addCart = joi.object().keys({
    productId: joi.string().min(24).max(24),
    quantity: joi.number().min(1).max(99999)
})
const productId = joi.object().keys({
    productId: joi.string().required().min(24).max(24)
})

const contectUs = joi.object().keys({
    title: joi.string().required().regex(pattern.title),
    description: joi.string().required().regex(pattern.description)
})

const faq = joi.object().keys({
    question: joi.string().required().regex(pattern.question),
    answer: joi.string().regex(pattern.description)
})

const answer = joi.object().keys({
    questionId: joi.string().required().min(24).max(24),
    answer: joi.string().required().regex(pattern.description)
})
const delFaq = joi.object().keys({
    question: joi.string().required().min(24).max(24),
    answer: joi.string().regex(pattern.description)
})
const delAns = joi.object().keys({
    questionId: joi.string().required().min(24).max(24),
    answer: joi.string().regex(pattern.description)
})


module.exports = {
    signUp,
    logIn,
    updateProfile,
    changePasswod,
    resetPassword,
    createCart,
    addCart,
    productId,
    contectUs,
    faq,
    answer,
    delAns,
    delFaq
}