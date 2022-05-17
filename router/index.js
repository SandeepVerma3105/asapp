const express = require("express")
const Router = express.Router()
const userRouters = require("./user/index")
const adminRouter = require("./admin/index")
Router.use(express.json())
Router.use(express.urlencoded({ extended: false }))

//routes for all module
Router.use("/admin", adminRouter)
Router.use("/user", userRouters)

module.exports = Router