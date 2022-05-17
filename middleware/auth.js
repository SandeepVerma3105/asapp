require('dotenv').config()
const httpStatus = require("http-status")
const jwt = require('jsonwebtoken');
const constant = require('../constants/constants');
const secretKey = process.env.SECRET_KEY
const errors = require('../error/error')
const jwtDecode = require("jwt-decode")
const { successResponse, errorResponse } = require("../response/response");
const { jwtToken } = require('../utils/jwtToket');

//verify token 
function verifyToken(req, res, next) {
    let token = req.headers['accesstoken'];
    console.log("TCL: verifyToken -> token", token)
    if (!token) return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        error: httpStatus.UNAUTHORIZED + " UNAUTHORIZED",
        message: "no token provided"
    });
    jwt.verify(token, secretKey, async function(error, decoded) {
        if (error) {
            console.log('------------>Token ERROR', error);
            result = await errorResponse({
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constant.TOKEN_EXPIRE
            })
            return res.status(httpStatus.UNAUTHORIZED).json(result)
        } else {
            req.tokenData = {
                id: decoded.id,
                email: decoded.email,
                token: token
            }
            console.log('------------------>>token verified')
            next();
        }
    });
}

//verify refresh 
function verifyRefreshToken(req, res, next) {
    let token = req.headers['accesstoken'];
    console.log("TCL: verifyToken -> token", token)
    if (!token) return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        error: httpStatus.UNAUTHORIZED + " UNAUTHORIZED",
        message: constant.NO_TOKEN_PROVIDED
    });
    jwt.verify(token, secretKey, async function(error, decoded) {
        if (error) {
            console.log('------------>Token ERROR', error);
            result = await errorResponse({
                    errCode: errors.UNAUTHORIZED.status,
                    errMsg: constant.TOKEN_EXPIRE
                },

            )
            return res.status(httpStatus.UNAUTHORIZED).json(result)
        }
    });
}


//valiation for admin to access apis
async function parseJwtAdmin(req, res, next) {
    let token = req.headers['accesstoken']
    const tokenData = jwtDecode(token)
    req.tokenData = tokenData
    if (tokenData.role != "admin") {
        result = await successResponse({
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constant.ADMIN_VALIDATION
            }

        )
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        next()
    }
}

//valiation for customer to access apis
async function parseJwtUser(req, res, next) {
    let token = req.headers['accesstoken']
    tokenData = jwtDecode(token)
    req.tokenData = tokenData
    if (tokenData.role != "user" && tokenData.role != "admin") {
        result = await successResponse({
            errCode: errors.UNAUTHORIZED.status,
            errMsg: constant.CUSTOMER_VALIDATION
        })
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        return next()
    }
}

module.exports = {
    verifyToken,
    parseJwtAdmin,
    parseJwtUser,
    verifyRefreshToken
}