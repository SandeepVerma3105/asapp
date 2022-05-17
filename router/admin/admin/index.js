const express = require("express")
const route = express.Router()
const adminController = require("./admincontroller")
const adminSchema = require("./adminSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")


route.post("/logIn", requestValidator(adminSchema.credeintial), adminController.logIn)

route.post("/privacyPolicy", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(adminSchema.privacyPolicy), adminController.addPrivacyPolicy)
route.get("/privacyPolicy", verifyToken.verifyToken, verifyToken.parseJwtUser, adminController.privacyPolicy)

route.post("/termAndCondition", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(adminSchema.termAndCondition), adminController.addTermAndCondition)
route.get("/termAndCondition", verifyToken.verifyToken, verifyToken.parseJwtUser, adminController.termAndCondition)
module.exports = route