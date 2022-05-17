const constants = require("../../../constants/constants")
const { User } = require("../../../models/user")
const { successResponse, errorResponse, notFoundResponse, internalServerResponse } = require("../../../response/response")
const helperService = require("../../../services/helper")
const productService = require("../../../services/product")
const errors = require("../../../error/error")
const httpStatus = require("http-status")
const { jwtToken } = require("../../../utils/jwtToket")
const bcrypt = require("bcrypt")
const email = require("../../../utils/email")
const { Cart } = require("../../../models/cart")
const { Product } = require("../../../models/product")
const { ObjectID } = require("BSON")
const { Offer } = require("../../../models/offers")
const { PrivacyPolicy } = require("../../../models/privacyPolicy")
const { TermAndCondition } = require("../../../models/termAndCondition")
const { ContectUs } = require("../../../models/contectUs")
const { FAQ } = require("../../../models/FAQ")
const { SubCategory } = require("../../../models/subCategory")

/*============================================================USER=====================================================*/
const signUp = async(req, res) => {
    data = req.item
    getData = await helperService.findOneQuery(User, { email: data.email })
    if (getData && getData != null) {
        result = await errorResponse({
            errCode: errors.CONFLICT.status,
            errMsg: constants.EMAIL_EXIST
        })
        res.status(httpStatus.CONFLICT).json(result)

    } else if (getData == null) {
        hashPass = bcrypt.hashSync(data.password, 10)
        getUserData = await helperService.insertQuery(User, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: hashPass
        })
        if (getUserData.length > 0) {
            token = jwtToken(getUserData[0].email, "user", getUserData[0]._id)
            result = await successResponse({
                    name: getUserData[0].firstName + " " + getUserData[0].lastName,
                    email: getUserData[0].email,
                    token: token
                },
                constants.REGISTRATION_SUCCESSFULLY
            )
            res.status(httpStatus.OK).json(result)
        } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        }
    }
}

const login = async(req, res) => {
    data = req.item
    getUserData = await helperService.findOneQuery(User, { email: data.email, isDelte: false })
    if (getUserData && !getUserData.code) {
        console.log("ddkksk")
        if ((bcrypt.compareSync(data.password, getUserData.password, 10)) == true) {
            token = jwtToken(getUserData.email, "user", getUserData._id)
            result = await successResponse({
                    name: getUserData.firstName + " " + getUserData.lastName,
                    email: getUserData.email,
                    token: token
                },
                constants.LOGIN
            )
            res.status(httpStatus.OK).json(result)
        } else {
            console.log(getUserData == null)
            result = await errorResponse({
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constants.INVALID_CREDENTIAL
            })
            res.status(httpStatus.UNAUTHORIZED).json(result)
        }
    } else if (getUserData == null) {
        console.log(getUserData == null)
        result = await errorResponse({
            errCode: errors.UNAUTHORIZED.status,
            errMsg: constants.INVALID_CREDENTIAL
        })
        res.status(httpStatus.UNAUTHORIZED).json(result)
    }
    if (getUserData && getUserData.code) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const updateProfile = async(req, res) => {
    data = req.item
    qury = req.tokenData.id

    getData = await helperService.updateById(User, qury, data)
    console.log(getData)
    if (getData && getData.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getData) {
        result = await successResponse(
            getData,
            constants.PROFILE_UPDATED
        )
        res.status(httpStatus.OK).json(result)
    }
}

const changePasswod = async(req, res) => {
    data = req.item
    qury = req.tokenData.id
    if (data.password) {
        hashPass = bcrypt.hashSync(data.password, 10)
        data.password = hashPass
    }
    getPass = await helperService.findOneQuery(User, { _id: req.tokenData.id })

    if (getPass && !getPass.code) {
        if ((bcrypt.compareSync(data.oldPassword, getPass.password, 10)) == true) {
            getdata = await helperService.updateById(User, qury, { password: data.password })
            if (getdata && getdata.code == 0) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
            } else if (getdata == null) {
                res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
            } else if (getdata && getdata != null) {
                result = await successResponse(
                    getdata,
                    constants.PASSWORD_CHANGED
                )
                res.status(httpStatus.OK).json(result)
            }
        } else if (getPass && !getPass.code) {
            result = await successResponse({
                errCode: errors.BAD_REQUEST.status,
                errMsg: constants.OLD_PASSWORD
            })
            res.status(httpStatus.BAD_REQUEST).json(result)
        }
    }
}

const forgetPassword = async(req, res) => {
    data = req.item
    let getData = await helperService.findOneQuery(User, { email: data.email })
    if (getData && !getData.code) {
        let email_id = data.email
        email.reset_mail(email_id, getData._id, constants.FORGET_PASSWORD)
        const result = successResponse(
            email_id,
            constants.RESET_PASSWORD_LINK
        )
    } else if (getData == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getData && getData == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const deleteProfile = async(req, res) => {
    qury = req.tokenData.id
    getData = await helperService.updateById(User, qury, { isDelete: true })
    if (getData && getData.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getData) {
        result = await successResponse(
            getData,
            constants.PROFILE_DELETED
        )
        res.status(httpStatus.OK).json(result)
    }
}


const changePhone = async(req, res, next) => {
    data = req.item
    userId = req.tokenData.id
    getdata = await helperService.updateById(User, userId, data)
    if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getdata == null) {
        return res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else {
        res.status(httpStatus.OK).json(await successResponse(constants.PHONE_UPDATED))

    }
}


/**==================================================PRODUCT========================================================== */
const productList = async(req, res) => {
    data = req.query

    field = [
        { path: "categoryId", model: "category", select: ["name", "_id"] },
        { path: "subCategoryId", model: "subCategory", select: ["name", "_id"] }
    ]

    if (req.query.searchString) {
        req.query.name = { $regex: '.*' + req.query.searchString + '.*', "$options": 'i' }

    }

    getData = await helperService.populateQuery(Product, data, field)
    if (getData.length == 0) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getData.length > 0) {
        const result = await successResponse(
            getData,
            constants.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}


const updateQuantity = async(req, res) => {
    data = req.body
    getData = await helperService.updateOne(Cart, { userId: req.tokenData.id, "products.productId": data.productId }, { $inc: { "products.$.quantity": data.quantity } })
    if (getData && getData != null) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getData == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse(constants.INVALID_PRODUCT_ID))
    } else if (getData && !getData.code) {
        result = await successResponse({
            deliveringTo: getData.deliveringTo,
            enterSala: getData.enterSala,
            row: getData.row,
            seatNo: getData.seatNo,
            products: getData.products
        })
        res.status(httpStatus.OK).json(result)
    }
}

const createCard = async(req, res) => {
    data = req.item
    getData = await helperService.upsert(Cart, req.tokenData.id, {
        userId: req.tokenData.id,
        deliveringTo: data.deliveringTo,
        enterSala: data.enterSala,
        row: data.row,
        seatNo: data.seat,
        product: []
    })

    if (getData && !getData.code) {
        result = await successResponse({
                userId: getData.userId,
                cartId: getData._id,
                deliveringTo: getData.deliveringTo,
                enterSala: getData.enterSala,
                row: getData.row,
                seatNo: getData.seatNo
            },
            constants.CART_CREATED
        )
        res.status(httpStatus.OK).json(result)
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }

}
const addCart = async(req, res) => {
    data = req.item
    let getData = await helperService.findOneQuery(Product, { _id: data.productId })
    if (getData && !getData.code) {
        getProduct = await helperService.upsert(Cart, req.tokenData.id, {
            $push: {
                products: {
                    productId: data.productId,
                    quantity: data.quantity,
                    subCategoryId: getData.subCategoryId,
                    price: getData.price,
                    totalAmount: Number(data.quantity * getData.price),
                }
            }
        })
        if (getProduct && !getProduct.code) {
            res.status(httpStatus.OK).json(await successResponse({
                userId: getProduct.userId,
                deliveringTo: getProduct.deliveringTo,
                enterSala: getProduct.enterSala,
                row: getProduct.row,
                seatNo: getProduct.seatNo,
                products: getProduct.products
            }, constants.ADD_PRODUCT_TO_CART))
        } else if (getProduct && getProduct.code == 0) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        }
    } else if (getData == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())

    } else if (getData && getData == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }

}

const checkCart = async(req, res) => {
    getdata = await helperService.findOneQuery(Cart, { userId: req.tokenData.id })
    if (getdata && getdata != null) {
        result = await successResponse({
            getdata
        }, constants.CHECK_CART)
        res.status(httpStatus.OK).json(result)
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const removeCart = async(req, res) => {
    data = req.item
    getdata = await helperService.updateOne(Cart, { userId: req.tokenData.id }, { $pull: { products: { productId: data.productId } } })
        // console.log("getjhjgsjhdgfgsjfjsgfsgf========>", getdata)
    if (getdata && getdata != null) {
        res.status(httpStatus.OK).json(
            await successResponse({
                getdata
            }, constants.REMOVE_PRODUCT_FROM_CART)
        )
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
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

const privacyPolicy = async(req, res) => {
    getdata = await helperService.findOneQuery(PrivacyPolicy)
    if (getdata && getdata != null) {
        result = await successResponse({
            getdata
        }, constants.PRIVACY_POLICY)
        res.status(httpStatus.OK).json(result)
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const termAndCondition = async(req, res) => {
    getdata = await helperService.findOneQuery(TermAndCondition)
    if (getdata && getdata != null) {
        result = await successResponse({
            getdata
        }, constants.TERM_AND_CONDITION)
        res.status(httpStatus.OK).json(result)
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const contectUs = async(req, res) => {
    let getCatData = await helperService.insertQuery(ContectUs, {
        userId: req.tokenData.id,
        title: data.title,
        description: data.descriptio
    })
    if (getCatData.errors) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
    if (getCatData.length > 0)
        result = await successResponse(
            getCatData,
            constants.CONTECT_US)
    res.status(httpStatus.OK).json(result)
}


const addFaq = async(req, res) => {
    data = req.item
    let getCatData = await helperService.insertQuery(FAQ, {
        question: data.question,
        answer: data.answer
    })
    if (getCatData.errors) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
    if (getCatData.length > 0)
        result = await successResponse(
            getCatData,
            constants.FAQ_ADDED)
    res.status(httpStatus.OK).json(result)

}

const faqList = async(req, res) => {
    getdata = await helperService.findQuery(FAQ, req.query)
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse({ data: getdata, count: getdata.count },
            constants.SUB_CATEGORY_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const deleteFaq = async(req, res) => {
    getdata = await helperService.deleteQuery(FAQ, req.query)
    if (getdata == false) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse("",
            constants.FAQ_DELETE
        )
        res.status(httpStatus.OK).json(result)
    }
}

const addAns = async(req, res) => {
    let getData = await helperService.updateById(FAQ, data.questionId, {
        $push: {
            answer: data.answer
        }
    })
    if (getData && getData.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
    if (getData && getData != null)
        result = await successResponse(
            getData,
            constants.FAQ_ADDED)
    res.status(httpStatus.OK).json(result)
}
const deleteAns = async(req, res) => {
    data = req.item
    getData = await helperService.updateOne(FAQ, { _id: data.questionId }, { $pull: { answer: data.answer } })
    if (getData && getData.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getData == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse(constants.INVALID_PRODUCT_ID))
    } else if (getData && getData != null) {
        res.status(httpStatus.OK).json(await successResponse(
            getData,
            constants.FAQ_DELETE
        ))
    }
}

const notiFication = async(req, res) => {
    data = req.query
    data.isDelete = false
    getdata = await helperService.findQuery(Offer, req.query)
    if (getdata.error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        data = []
        await getdata.forEach(async(element) => {

            getCatData = await helperService.findOneQuery(SubCategory, { _id: element.subCategoryId })
            console.log(getCatData.name)
            notify = element.discount + " % OFF on " + getCatData.name + " ASSAP",
                console.log("fsjfj", notify)
            await data.push(notify)
            return data
        })
        console.log("------==========>>", data)
        res.status(httpStatus.OK).json(await successResponse(data,
            constants.NOTIFICATION
        ))


    }
}

module.exports = {
    signUp,
    login,
    forgetPassword,
    updateProfile,
    changePasswod,
    deleteProfile,
    productList,
    updateQuantity,
    createCard,
    addCart,
    checkCart,
    removeCart,
    offerList,
    privacyPolicy,
    termAndCondition,
    contectUs,
    addFaq,
    addAns,
    faqList,
    deleteFaq,
    deleteAns,
    notiFication
}