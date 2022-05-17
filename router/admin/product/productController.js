const helperService = require("../../../services/helper")
const { Category } = require("../../../models/category")
const { errorResponse, successResponse, notFoundResponse } = require("../../../response/response")
const { SubCategory } = require("../../../models/subCategory")
const { Admin } = require("../../../models/admin")
const constants = require("../../../constants/constants")
const errors = require("../../../error/error")
const httpStatus = require("http-status")
const { Offer } = require("../../../models/offers")
const { coupon } = require("../../../utils/randonKeys")
const { Product } = require("../../../models/product")

const addCategory = async(req, res, next) => {
    data = req.item
    getdata = await helperService.findQuery(Category, { name: data.name })
    if (getdata.length > 0) {
        result = await errorResponse({
            errCode: errors.CONFLICT.status,
            errMsg: constants.CATEGORY_EXIST
        })
        res.status(httpStatus.CONFLICT).json(result)
    }
    if (getdata.length == 0) {
        let getCatData = await helperService.insertQuery(Category, {
            name: data.name,
            description: data.description
        })
        if (getCatData.errors) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        }
        if (getCatData.length > 0)
            result = await successResponse({
                    getCatData,
                },
                constants.CATEGORY_ADDED)
        res.status(httpStatus.OK).json(result)
    }
}


//get category List
const categoryList = async(req, res) => {
    getdata = await helperService.findQuery(Category, req.query)
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse({ data: getdata, count: getdata.count },
            constants.CATEGORY_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const addSubCategory = async(req, res) => {
    data = req.item
    await helperService.findQuery(Category, { _id: req.item.categoryId })
        .then(async(result) => {
            if (result.length > 0) {
                getdata = await helperService.findQuery(SubCategory, { name: data.name })
                if (getdata.length > 0) {
                    result = await errorResponse({
                        errCode: errors.CONFLICT.status,
                        errMsg: constants.SUB_CATEGORY_EXIST
                    })
                    res.status(httpStatus.CONFLICT).json(result)
                }
                if (getdata == 0) {
                    let getSubCat = await helperService.insertQuery(SubCategory, {
                        categoryId: data.categoryId,
                        name: data.name,
                        description: data.description
                    })
                    if (getSubCat.errors) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
                    }
                    if (getSubCat.length > 0)
                        result = await successResponse(
                            getSubCat[0],
                            constants.SUB_CATEGORY_ADDED)
                    res.status(httpStatus.OK).json(result)
                }
            }
        }).catch(async(err) => {
            console.log(err)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        })
}

const subCategoryList = async(req, res) => {

    getdata = await helperService.findQuery(SubCategory, req.query)
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse({ data: getdata, count: getdata.count },
            constants.SUB_CATEGORY_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const addOffers = async(req, res) => {
    data = req.item
    coupon = await coupon()
    await helperService.findQuery(SubCategory, { _id: req.item.subCategoryId })
        .then(async(result) => {
            if (result.length > 0) {
                getdata = await helperService.findQuery(Offer, { subCategoryId: data.subCategoryId })
                if (getdata.length > 0) {
                    result = await errorResponse({
                        errCode: errors.CONFLICT.status,
                        errMsg: constants.OFFER_EXIST
                    })
                    res.status(httpStatus.CONFLICT).json(result)
                }
                if (getdata == 0) {
                    let getOffer = await helperService.insertQuery(Offer, {
                        subCategoryId: data.subCategoryId,
                        discount: data.discount,
                        couponCode: "ASAPP" + coupon,
                        description: data.description
                    })
                    console.log(getOffer)
                    if (getOffer.errors) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
                    }
                    if (getOffer.length > 0)
                        result = await successResponse(
                            getOffer[0],
                            constants.OFFER_ADDED)
                    res.status(httpStatus.OK).json(result)
                }
            } else if (result.length == 0) {
                // result = await errorResponse({
                //     errCode: errors.DATA_NOT_FOUND.status,
                //     errMsg: constants.SUB_CATEGORY_ID_NOT_EXIST
                // })
                // res.status(httpStatus.NOT_FOUND).json(result)
                res.status(httpStatus.NOT_FOUND).json(await notFoundResponse(constants.SUB_CATEGORY_ID_NOT_EXIST))

            }
        }).catch(async(err) => {
            console.log(err)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        })
}

const offerList = async(req, res) => {
    getdata = await helperService.findQuery(Offer, req.query)
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse({ data: getdata, count: getdata.count },
            constants.OFFER_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}


const updateOffer = async(req, res, next) => {
    data = req.item
    offerId = req.query.offerId
    getdata = await helperService.updateById(Offer, offerId, data)
    if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getdata == null) {
        return res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else {
        if (data.isDelete) {
            msg = constants.OFFER_DELETED,
                response = getdata
        } else {
            msg = constants.OFFER_UPDATED,
                response = getdata
        }
        res.status(httpStatus.OK).json(await successResponse(response, msg))

    }
}

const addProduct = async(req, res) => {
    data = req.item
    let getdata = await helperService.insertQuery(Product, {
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        image: data.image,
        price: data.price,
    })
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse(
            getdata,
            constants.ADD_PEODUCT
        )
        res.status(httpStatus.OK).json(result)
    }

}

const productList = async(req, res) => {
    req.query.isDelete = false
    getdata = await helperService.findQuery(Product, req.query)
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse({ data: getdata, count: getdata.count },
            constants.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const updateProduct = async(req, res, next) => {
    data = req.item
    data.updatedAt = new Date()
    productId = req.query.productId
    getdata = await helperService.updateById(Product, productId, data)
    if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getdata == null) {
        result = await errorResponse({
            errCode: errors.DATA_NOT_FOUND.status,
            errMsg: constants.DATA_NOT_FOUND
        })
        res.status(httpStatus.NOT_FOUND).json(result)
    } else {
        if (data.isDelete) {
            msg = constants.PRODUCT_DELETED,
                response = getdata
        } else {
            msg = constants.PRODUCT_UPDATED,
                response = getdata
        }
        result = await successResponse(
            response,
            msg
        )
        res.status(httpStatus.OK).json(result)

    }
}


module.exports = {
    addCategory,
    categoryList,
    addSubCategory,
    subCategoryList,
    addOffers,
    offerList,
    updateOffer,
    addProduct,
    productList,
    updateProduct
}