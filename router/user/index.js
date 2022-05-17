const express = require("express")
const Router = express.Router()
const userRoutes = require("./user/index")
const orderRoutes = require("./order/index")
const paymentRoutes = require("./payment/index")
    //routes for customer
Router.use("/", userRoutes)
Router.use("/order", orderRoutes)
Router.use("/payment", paymentRoutes)

module.exports = Router