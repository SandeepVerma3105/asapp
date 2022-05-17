const { ObjectID } = require("bson")
const bcrypt = require("bcrypt")
const httpStatus = require("http-status")
const { PaymentModel, Payment } = require("../../../models/payment")

const constents = require("../../../constants/constants")
const errors = require("../../../error/error")
const { jwtToken, parseJwt } = require("../../../utils/jwtToket")
const KEY = require("../../../utils/randonKeys")
const helperService = require("../../../services/helper")
const req = require("express/lib/request")
const { User } = require("../../../models/user")
const { errorResponse, internalServerResponse, notFoundResponse, successResponse } = require("../../../response/response")
const { Order } = require("../../../models/order")



//add card detaill for payment
const paymentDetail = async(req, res, next) => {
    data = req.item
        //check to the user exist or not
    getUserData = await helperService.findOneQuery(User, { _id: ObjectID(req.tokenData.id) })
    if (getUserData && getUserData != null) {
        //check to card is exist or not 
        getCardData = await helperService.findOneQuery(Payment, { cardNo: data.cardNo })
        if (getCardData && getCardData != null) {
            result = await errorResponse({
                errCode: errors.CONFLICT.status,
                errMsg: constents.CARD_EXIST
            })
            res.status(httpStatus.CONFLICT).json(result)
        } else {
            //create random payment key
            paymentKey = await KEY.randomKey()
                //inserting data into payment collection
            let getdata = await helperService.insertQuery(Payment, {
                userId: getUserData._id,
                cardNo: data.cardNo,
                cardName: data.cardName,
                cardHolderName: data.cardHolderName,
                cvvNo: data.cvvNo,
                expDate: data.expDate,
                paymentKey: paymentKey,
            })
            if (getdata && getdata.code == 0) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
            } else {
                result = await successResponse(
                    getdata,
                    constents.CARD_ADDED)
                res.status(httpStatus.OK).json(result)
            }
        }
    } else {
        res.status(httpStatus.OK).json(await notFoundResponse(constents.USER_NOT_EXIST))
    }
}

//get all card list of perticular user or a single card detail
const paymentList = async(req, res, next) => {
    data = req.query
    data.userId = req.tokenData.id
    getdata = await helperService.findQuery(Payment, data)
    if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        result = await successResponse(
            getdata,
            constents.CARD_LIST)
        res.status(httpStatus.OK).json(result)
    }
}

// update card detail
const updatepayment = async(req, res, next) => {
    data = req.item
    getdata = await helperService.updateOne(
        Payment, { _id: req.query.id, userId: req.tokenData.id },
        data
    )
    if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
    if (getdata == 0) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else {
        result = await successResponse(
            getdata,
            constents.CARD_UPDATE)
        res.status(httpStatus.OK).json(result)
    }
}

//delete card detail
const deletepayment = async(req, res, next) => {
    data = req.query.cardId
    getdata = await helperService.deleteQuery(Payment, { _id: data, userId: req.tokenData.id })
    if (getdata == true) {
        res.status(httpStatus.OK).json(await successResponse(
            "", constents.CARD_DELETE
        ))
    }
    if (getdata == false) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    }
}

// make payment  controller
const makePayment = async(req, res) => {

    data = req.item
        //generate a tansection id
    transectionId = await KEY.randomKey()
    getdata = await helperService.updateById(Order, data.orderId, { transectionId: transectionId, transectionStatus: "PAID" })
    if (getdata && getdata.code == 0) {
        res.status(httpStatus.OK).json(await internalServerResponse())
    } else if (getdata && getdata !== null) {
        res.status(httpStatus.OK).json(await successResponse(getdata, constents.PAYMENT_SUCCESSFULL))
    }

}

module.exports = {
    paymentDetail,
    paymentList,
    deletepayment,
    updatepayment,
    makePayment
}