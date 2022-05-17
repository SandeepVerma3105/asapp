const httpStatus = require("http-status")
const { ObjectID } = require("bson")


const constents = require("../../../constants/constants")
const errors = require("../../../error/error")
const helperService = require("../../../services/helper")
const { Order } = require("../../../models/order")
const { notFoundResponse, successResponse, internalServerResponse, errorResponse } = require("../../../response/response")

//order list of a prticular merchant

const orders = async(req, res) => {
    data = req.query
        // data.userId = req.tokenData.id
    getData = await helperService.findQuery(Order, data)
    if (getData == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getData && getData.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    } else {
        res.status(httpStatus.OK).json(await successResponse(
            getData,
            constents.ORDER_DETAIL
        ))
    }
}


//change the status of an order
const changeOrederStatus = async(req, res) => {
    data = req.item
    msg = ""

    if (data.status != 1 && data.status != 2 && data.status != 3 && data.status != 4 && data.status != 5) {
        result = await errorResponse({
            errCode: errors.BAD_REQUEST.status,
            errMsg: constents.INVALID_ORDER_STATUS
        })
        return res.status(httpStatus.BAD_REQUEST).json(result)
    }

    if (data.status == 1) {
        msg = constents.ORDER_PENDING
        data.status = "PENDING"
    }
    if (data.status == 2) {
        msg = constents.ORDER_ACCEPTED
        data.status = "ACCEPTED"
    }
    if (data.status == 3) {
        msg = constents.ORDER_CANCEL
        data.status = "CANCEL"
    }
    if (data.status == 4) {
        msg = constents.ORDER_IN_TRANSIT
        data.status = "INTRASIT"
    }
    if (data.status == 5) {
        msg = constents.ORDER_DELEVERED
        data.status = "DELEVERED"
    }

    getdata = await helperService.updateOne(Order, { _id: data.orderId }, { orderStatus: data.status })
    if (getdata && getdata.code == 0) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
    if (getdata && getdata == null) {
        return res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else {
        return res.status(httpStatus.OK).json(await successResponse(getdata))
    }
}

// //accept an order
// //befor accept an order check the unit of prodct is available or not
// const acceptOrder = async(req, res) => {
//     data = req.body
//     checkUnit = await helperService.populateQuery(
//         OrderDetailModel, { _id: data.orderId }, {
//             path: "productId",
//             model: "product",
//             select: ["_id", "name", "lastName", "unit"]
//         }
//     )
//     console.log(checkUnit)
//     if (checkUnit == 0) {
//         result = await successResponse(
//             true,
//             null,
//             httpStatus.OK, {
//                 errCode: errors.DATA_NOT_FOUND.status,
//                 errMsg: constents.DATA_NOT_FOUND
//             },
//             ""
//         )
//         res.status(httpStatus.NOT_FOUND).json(result)
//     }
//     if (checkUnit.length > 0 && checkUnit[0].productId.unit >= checkUnit[0].unit) {
//         getdata = await helperService.updateByIdQuery(
//             OrderDetailModel,
//             data.orderId, { orderStatus: 2 }
//         )
//         if (getdata.reason) {
//             result = await successResponse(
//                 true,
//                 null,
//                 httpStatus.OK, {
//                     errCode: errors.INTERNAL_SERVER_ERROR.status,
//                     errMsg: constents.INTERNAL_SERVER_ERROR
//                 },
//                 ""
//             )
//             res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
//         }
//         if (getdata == 0) {
//             result = await successResponse(
//                 true,
//                 null,
//                 httpStatus.OK, {
//                     errCode: errors.DATA_NOT_FOUND.status,
//                     errMsg: constents.DATA_NOT_FOUND
//                 },
//                 ""
//             )
//             res.status(httpStatus.NOT_FOUND).json(result)
//         } else {

//             result = await successResponse(
//                 true, {
//                     order: getdata
//                 },
//                 httpStatus.OK,
//                 "",
//                 constents.CHANGE_ORDER_STATUS
//             )
//             res.status(httpStatus.OK).json(result)
//         }
//     }
//     if (checkUnit.length > 0 && checkUnit[0].productId.unit <= checkUnit[0].unit) {
//         result = await successResponse(
//             true, {
//                 productQuantity: checkUnit[0].productId.unit,
//                 orderQuantity: checkUnit[0].unit
//             },
//             httpStatus.OK, {
//                 errCode: errors.BAD_REQUEST.status,
//                 errMsg: constents.QUANTITY
//             },
//             ""
//         )
//         res.status(httpStatus.BAD_REQUEST).json(result)
//     }
// }

// //find a prticular order detail
// const ordersDetail = async(req, res) => {
//     field = [
//         { path: "productId", model: "product", select: ["name"] },
//     ]

//     if (req.query._id) {
//         field = [
//             { path: "userId", model: "user", select: ["_id", "firstName", "lastName", "email"] },
//             { path: "productId", model: "product", select: ["name"] },
//             { path: "userAddressId", model: "userAddress" },
//         ]
//     }

//     getdata = await helperService.populateQuery(OrderDetailModel, req.query, field)
//     if (getdata.error) {
//         result = await successResponse(
//             true,
//             null,
//             httpStatus.OK, {
//                 errCode: errors.INTERNAL_SERVER_ERROR.status,
//                 errMsg: constents.INTERNAL_SERVER_ERROR
//             },
//             ""
//         )
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
//     }
//     if (getdata == 0) {
//         result = await successResponse(
//             true, { data: [], count: 0 },
//             httpStatus.OK,
//             "",
//             constents.ORDER_LIST
//         )
//         res.status(httpStatus.OK).json(result)
//     }
//     if (getdata.length > 0) {
//         result = await successResponse(
//             true, { data: getdata, count: getdata.count },
//             httpStatus.OK,
//             "",
//             constents.ORDER_LIST
//         )
//         res.status(httpStatus.OK).json(result)
//     }
// }


module.exports = {
    orders,
    changeOrederStatus,
    // acceptOrder,
    // ordersDetail
}