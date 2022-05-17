const { Admin } = require("../../../models/admin")
const helperService = require("../../../services/helper")
const { jwtToken } = require("../../../utils/jwtToket")
const { successResponse, errorResponse } = require("../../../response/response")
const constants = require("../../../constants/constants")
const errors = require("../../../error/error")
const httpStatus = require("http-status")
const { PrivacyPolicy } = require("../../../models/privacyPolicy")
const { TermAndCondition } = require("../../../models/termAndCondition")

const logIn = async(req, res) => {
    data = req.item
    console.log(data)
    let getdata = await helperService.findQuery(Admin, data)
    if (getdata.length > 0) {
        let token = jwtToken(getdata[0].email, getdata[0].role, getdata[0]._id)
        result = await successResponse({
                _id: getdata[0]._id,
                fullName: getdata.name,
                email: getdata[0].email,
                token: token,
            },
            constants.LOG_IN)
        res.status(httpStatus.OK).json(result)
    }
    if (getdata.length == 0) {
        result = await errorResponse({
            errCode: errors.UNAUTHORIZED.status,
            errMsg: constants.INVALID_CREDENTIAL
        })
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else if (getdata.err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}


const addPrivacyPolicy = async(req, res) => {
    data = req.item
    getdata = await helperService.findQuery(PrivacyPolicy, { title: data.title })
    if (getdata.length > 0) {
        result = await errorResponse({
            errCode: errors.CONFLICT.status,
            errMsg: constants.PRIVACY_POLICY_EXIST
        })
        res.status(httpStatus.CONFLICT).json(result)
    }
    if (getdata.length == 0) {
        let getCatData = await helperService.insertQuery(PrivacyPolicy, {
            title: data.title,
            privacyPolicy: data.privacyPolicy
        })
        if (getCatData.errors) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        }
        if (getCatData.length > 0)
            result = await successResponse(
                getCatData,
                constants.PRIVACY_POLICY_ADDED)
        res.status(httpStatus.OK).json(result)
    }
}

const addTermAndCondition = async(req, res) => {
    data = req.item
    getdata = await helperService.findQuery(TermAndCondition, { title: data.title })
    if (getdata.length > 0) {
        result = await errorResponse({
            errCode: errors.CONFLICT.status,
            errMsg: constants.TERM_AND_CONDITION_EXIST
        })
        res.status(httpStatus.CONFLICT).json(result)
    }
    if (getdata.length == 0) {
        let getCatData = await helperService.insertQuery(TermAndCondition, {
            title: data.title,
            termAndCondition: data.termAndCondition
        })
        if (getCatData.errors) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
        }
        if (getCatData.length > 0)
            result = await successResponse(
                getCatData,
                constants.TERM_AND_CONDITION_ADDED)
        res.status(httpStatus.OK).json(result)
    }
}

const privacyPolicy = async(req, res) => {
    getdata = await helperService.findOneQuery(PrivacyPolicy)
    if (getdata && getdata != null) {
        result = await successResponse({
            getdata
        }, constants.PRIVACY_POLICY)
        res.status(httpStatus.OK).json(result)
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}

const termAndCondition = async(req, res) => {
    getdata = await helperService.findOneQuery(TermAndCondition)
    if (getdata && getdata != null) {
        result = await successResponse({
            getdata
        }, constants.TERM_AND_CONDITION)
        res.status(httpStatus.OK).json(result)
    } else if (getdata == null) {
        res.status(httpStatus.NOT_FOUND).json(await notFoundResponse())
    } else if (getdata && getdata.code == 0) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(await internalServerResponse())
    }
}


module.exports = {
    logIn,
    addPrivacyPolicy,
    privacyPolicy,
    addTermAndCondition,
    termAndCondition,

}