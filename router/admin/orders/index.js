const express = require("express")
const route = express.Router()
const orderController = require("./orderController")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")
const orderSchema = require("./orderSchema")

/**************************** merchant/ order APIs ************************************************************************ */

route.get("/orders", verifyToken.verifyToken, verifyToken.parseJwtAdmin, orderController.orders)
route.put("/changeOrderStatus", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(orderSchema.status, "query"), orderController.changeOrederStatus)
    // route.get("/orderDetail", verifyToken.verifyToken, verifyToken.parseJwtAdmin, orderController.ordersDetail)

/**************************************************************************************************************************8*****/


module.exports = route