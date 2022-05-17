const { Admin } = require("../models/admin")
const { FAQ } = require("../models/FAQ")
const { Cart } = require("../models/cart")
const { Category } = require("../models/category")
const { ContectUs } = require("../models/contectUs")
const { Offer } = require("../models/offers")
const { Order } = require("../models/order")
const { PrivacyPolicy } = require("../models/privacyPolicy")
const { Product } = require("../models/product")
const { SubCategory } = require("../models/subCategory")
const { termAndCondition } = require("../models/termAndCondition")
const { Payment } = require("../models/payment")


//query to find the single data from respective collection
const findOneQuery = async(model, data) => {
    return await model.findOne(data).select(["-__v"])
        .then(async(result) => {
            return result
        }).catch(errors => {
            console.log(errors)
            errors.code = 0
            return (errors)
        })

}

//query to find the data from respective collection
const findQuery = async(model, data) => {
    return await model.find(data).select(["-__v", ])
        .then(async(result) => {
            count = await model.find(data).count()
            result.count = count
            return result
        }).catch(errors => {
            console.log(errors)
            return errors
        })

}

const insertQuery = async(model, data) => {
    return await model.insertMany(data)
        .then(async(result) => {
            return result
        }).catch(errors => {
            console.log(errors)
            return errors
        })
}

const updateById = async(model, id, data) => {
    console.log("query", id, data)
    return await model.findByIdAndUpdate(id, data, { new: true })
        .then(async(result) => {
            return result
        }).catch(async(errors) => {
            errors.code = 0
            console.log(errors)
            return errors
        })
}

const updateOne = async(model, query, data) => {
    console.log("query", query, data)
    return await model.findOneAndUpdate(query, data, { new: true })
        .then(async(result) => {
            return result
        }).catch(async(errors) => {
            errors.code = 0
            console.log(errors)
            return errors
        })
}

const upsert = async(model, id, data) => {
    return await model.findByIdAndUpdate(id, data, { new: true, upsert: true })
        .then(async(result) => {
            return result
        }).catch(async(errors) => {
            errors.code = 0
            console.log(errors)
            return errors
        })
}

const deleteQuery = async(model, data) => {
    return await model.deleteOne(data)
        .then(async(result) => {
            console.log(result)
            return true
        })
        .catch((errors) => {
            console.log(errors)
            return false
        })
}

const populateQuery = async(model, data, field) => {

    data.isDelete = false
    if (!data.sortKey && !data.order) {
        sort = {}
    }
    if (data.sortKey && !data.order) {
        sortKey = data.sortKey,
            sort = { sortKey: 1 }
    }
    if (!data.sortKey && data.order) {
        sort = { _id: -1 }
    } else {
        sortKey = data.sortKey,
            order = data.order
        sort = {
            [sortKey]: order
        }
    }
    try {
        res = await model.find(data).skip(data.skip).limit(data.limit).sort(sort).populate(field).select(["-__v"])
        if (res.length > 0) {
            count = await model.find(data).count()
            res.count = count
            return res
        } else {
            return 0
        }
    } catch (error) {
        return error
    }
}


module.exports = {
    findOneQuery,
    findQuery,
    insertQuery,
    updateById,
    updateOne,
    upsert,
    deleteQuery,
    populateQuery
}