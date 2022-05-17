const express = require("express")
const route = express.Router()
const orderController = require("./orderContrroller")
const orderSchema = require("./orderSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.post("/placeOrder", verifyToken.verifyToken, verifyToken.parseJwtUser, orderController.placeOrder)
route.get("/orders", verifyToken.verifyToken, verifyToken.parseJwtUser, orderController.orders)
route.put("/updateDetail", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(orderSchema.updateDetail), orderController.updateDetail)
module.exports = route