const httpStatus = require("http-status")
const array = require("joi/lib/types/array")
const { toArray } = require("lodash")
const constants = require("../../../constants/constants")
const { Cart } = require("../../../models/cart")
const { Offer } = require("../../../models/offers")
const { Order } = require("../../../models/order")
const { User } = require("../../../models/user")
const { internalServerResponse, notFoundResponse, successResponse } = require("../../../response/response")
const helperService = require("../../../services/helper")
const orderService = require("../../../services/order")

const placeOrder = async(req, res) => {
    data = req.body
    getdata = await helperService.findOneQuery(Cart, { userId: req.tokenData.id })
    console.log(getdata)
    if (getdata && getdata != null) {
        let coupon = ""
        console.log(data.couponCode)
        if (data.couponCode) {
            let getcoupon = await helperService.findOneQuery(Offer, { couponCode: data.couponCode })
            if (getcoupon && getcoupon != null) {
                coupon = getcoupon
            }
            if (getcoupon == null) {
                return res.status(httpStatus.NOT_FOUND).json(await notFoundResponse(constants.INVALID_coupon))
            }
        }
        let products = toArray(getdata.products)
        total = 0
        grandTotal = 0
        products.forEach(element => {
            if (data.couponCode) {
                if (element.subCategoryId.equals(coupon.subCategoryId)) {
                    grandTotal = Number(grandTotal) - Number(element.totalAmount * coupon.discount) / 100
                }
            }
            console.log(element.totalAmount)
            total = Number(total) + Number(element.totalAmount)
            grandTotal = Number(grandTotal) + Number(element.totalAmount)
        });
        getUser = await helperService.findOneQuery(User, { _id: req.tokenData.id })
        let orderData = await helperService.insertQuery(Order, {
            userId: getdata.userId,
            firstName: getUser.firstName,
            lastName: getUser.lastName,
            phoneNumber: getUser.phoneNumber,
            deliveringTo: getdata.deliveringTo,
            enterSala: getdata.enterSala,
            products: getdata.products,
            row: getdata.row,
            seatNo: getdata.seatNo,
            couponCode: data.couponCode,
            paymentType: data.paymentType,
            total: total,
            grandTotal: grandTotal
        })
        if (orderData.length > 0) {
            await helperService.deleteQuery(Cart, { userId: req.tokenData.id })
            return res.status(httpStatus.OK).json(await successResponse(orderData, constants.ORDER_DETAIL))
        } else {
            res.status(httpStatus.INNOTERNAL_SERVER_ERROR).json(await internalServerResponse())
        }
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const orders = async(req, res) => {
    data = req.query
    data.userId = req.tokenData.id
    getData = await helperService.findQuery(Order, data)
    if (getData == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getData && getData.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        res.status(httpStatus.OK).json(await successResponse(
            getData
        ))
    }
}
const updateDetail = async(req, res) => {
    data = req.body
    getdata = await helperService.updateOne(
            Order, { _id: data.orderId, userId: req.tokenData.id },
            data
        )
        // console.log(getdata)
    if (getdata && getdata != null) {
        result = await successResponse({
            getdata
        })
        res.status(httpStatus.OK).json(result)
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse(constants.INVALID_PRODUCT_ID))
    }
}
module.exports = {
    placeOrder,
    orders,
    updateDetail
}