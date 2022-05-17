const express = require("express")
const Router = express.Router()
const adminRouter = require("./admin/index")
const productRouter = require("./product/index")
const orderRouter = require("./orders/index")
    //routes for customer
Router.use("/", adminRouter)
Router.use("/product", productRouter)
Router.use("/order", orderRouter)


module.exports = Router