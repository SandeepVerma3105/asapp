const express = require("express")
const route = express.Router()
const productController = require("./productController")
const productSchema = require("./productSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.post("/category", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.category), productController.addCategory)
route.get("/category", verifyToken.verifyToken, verifyToken.parseJwtAdmin, productController.categoryList)

route.post("/subCategory", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.subCategory), productController.addSubCategory)
route.get("/subCategory", verifyToken.verifyToken, verifyToken.parseJwtAdmin, productController.subCategoryList)

route.post("/offers", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.offer), productController.addOffers)
route.get("/offers", verifyToken.verifyToken, verifyToken.parseJwtAdmin, productController.offerList)
route.put("/offers", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.offerId, "query"), requestValidator(productSchema.updateOffer), productController.updateOffer)
route.delete("/offers", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.offerId, "query"), requestValidator(productSchema.isDelete), productController.updateOffer)

route.post("/product", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.addProduct), productController.addProduct)
route.get("/product", verifyToken.verifyToken, verifyToken.parseJwtAdmin, productController.productList)
route.put("/product", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.productId, "query"), requestValidator(productSchema.updateProduct), productController.updateProduct)
route.delete("/product", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(productSchema.productId, "query"), requestValidator(productSchema.isDelete), productController.updateProduct)

module.exports = route