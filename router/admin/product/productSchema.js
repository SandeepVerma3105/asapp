const joi = require("joi")
const pattern = require("../../../utils/regex")

const addProduct = joi.object().keys({
    categoryId: joi.string().required().min(24).max(24),
    subCategoryId: joi.string().required().min(24).max(24),
    name: joi.string().min(2).required().regex(pattern.productName),
    description: joi.string().required().min(50).max(150),
    quantity: joi.number().integer().required().min(1).max(9999999999),
    image: joi.string(),
    price: joi.number().required().min(0).max(9999999999),
})

const updateProduct = joi.object().keys({
    name: joi.string().min(2).regex(pattern.productName),
    description: joi.string().min(50).max(150),
    quantity: joi.number().integer().min(1).max(9999999999),
    image: joi.string(),
    price: joi.number().min(0).max(9999999999),
})

const category = joi.object().keys({
    name: joi.string().required().regex(pattern.categoryName),
    description: joi.string().required().regex(pattern.description)
})
const subCategory = joi.object().keys({
    categoryId: joi.string().min(24).max(24).required(),
    name: joi.string().required().max(30).regex(pattern.categoryName),
    description: joi.string().required().regex(pattern.description)
})

const offer = joi.object().keys({
    subCategoryId: joi.string().required().min(24).max(24),
    discount: joi.number().min(0).max(100),
    description: joi.string().required().regex(pattern.description)
})
const updateOffer = joi.object().keys({
    discount: joi.number().min(0).max(100),
    description: joi.string().required().regex(pattern.description)
})

const offerId = joi.object().keys({
    offerId: joi.string().required().min(24).max(24),
})

const productId = joi.object().keys({
    productId: joi.string().min(24).max(24)
})

const isDelete = joi.object().keys({
    isDelete: joi.boolean().required()
})

module.exports = {
    addProduct,
    updateProduct,
    category,
    subCategory,
    offer,
    updateOffer,
    offerId,
    productId,
    isDelete,

}