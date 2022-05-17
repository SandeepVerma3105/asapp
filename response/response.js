const constants = require("../constants/constants")
const errors = require("../error/error")
    //resopnse structure
const successResponse = async(response, message, data) => {
    data = {
        "status": true,
        "response": response,
        "code": 200,
        "error": null,
        "msg": message
    }
    return data
}

const errorResponse = async(error, data) => {
    data = {
        "status": true,
        "response": null,
        "code": 200,
        "error": error,
        "msg": ""
    }
    return data
}

const internalServerResponse = async(error, data) => {
    data = {
        "status": true,
        "response": null,
        "code": 200,
        "error": {
            errCode: errors.INTERNAL_SERVER_ERROR.status,
            errMsg: constants.INTERNAL_SERVER_ERROR
        },
        "msg": ""
    }
    return data
}

const notFoundResponse = async(errMsg = constants.DATA_NOT_FOUND, data) => {
    data = {
        "status": true,
        "response": null,
        "code": 200,
        "error": {
            errCode: errors.DATA_NOT_FOUND.status,
            errMsg: errMsg
        },
        "msg": ""
    }
    return data
}




module.exports = {
    successResponse,
    errorResponse,
    internalServerResponse,
    notFoundResponse


}