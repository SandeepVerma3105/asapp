const req = require("express/lib/request")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const SECRET_KEY = process.env.SECRET_KEY

//function to generate jwt token
const jwtToken = (email, role, id) => {
    const token = jwt.sign({
            user: email,
            role: role,
            id: id
        },
        SECRET_KEY, {
            expiresIn: "60000s"
        })
    return token
}

//function to generate jwt token
const jwtrefreshToken = (email, role, id) => {
    const token = jwt.sign({
            user: email,
            role: role,
            id: id
        },
        SECRET_KEY, {
            expiresIn: "6d"
        })
    return token
}

module.exports = {
    jwtToken,
    jwtrefreshToken
}