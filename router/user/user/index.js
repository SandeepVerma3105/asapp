const express = require("express")
const route = express.Router()
const userSchema = require("./userSchema")
const userController = require("./userContrroller")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.post("/signUp", requestValidator(userSchema.signUp), userController.signUp)
route.post("/logIn", requestValidator(userSchema.logIn), userController.login)
route.put("/updateProfile", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.updateProfile), userController.updateProfile)
route.put("/changePassword", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.changePasswod), userController.changePasswod)
route.post("/resetPassword", verifyToken.verifyToken, requestValidator(userSchema.resetPassword, "query"), userController.forgetPassword)
route.delete("/deleteProfile", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.deleteProfile)

route.get("/product", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.productList)
route.put("/updateQuantity", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.updateQuantity)
route.post("/createCart", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.createCart), userController.createCard)
route.put("/addCart", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.addCart), userController.addCart)
route.get("/checkCart", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.addCart), userController.checkCart)
route.put("/updateQuantity", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.addCart), userController.updateQuantity)
route.put("/removeCart", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.productId), userController.removeCart)
route.get("/coupon", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.offerList)

route.get("/privacyPolicy", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.privacyPolicy)
route.get("/termAndCondition", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.termAndCondition)
route.post("/contectUs", verifyToken.verifyToken, requestValidator(userSchema.contectUs), verifyToken.parseJwtUser, userController.contectUs)

route.post("/faq", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.faq), userController.addFaq)
route.get("/faq", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.faqList)
route.delete("/faq", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.delFaq), userController.deleteFaq)
route.put("/ans", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.answer), userController.addAns)
route.delete("/ans", verifyToken.verifyToken, verifyToken.parseJwtUser, requestValidator(userSchema.delAns), userController.deleteAns)
route.get("/notification", verifyToken.verifyToken, verifyToken.parseJwtUser, userController.notiFication)


module.exports = route