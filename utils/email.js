var nodemailer = require('nodemailer');
const express = require('express')
const dotenv = require("dotenv")
const app = express()
const port = 3000

const user = process.env.FROM_EMAIL
const pass = process.env.PASSWORD

//send mail to verify account
var sendmail = (tomail, subject = "verify", req, res) => {
    var sender = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 8081,
        service: 'gmail',
        auth: {
            // user: user,
            // pass: pass
            api_key: "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"
        }
    });

    var mailOptions = {
        from: 'sandeepyaya3105@gmail.com',
        to: tomail,
        subject: subject,
        html: `<h3>Please click on button to activate your account</h3><br><a href='http://localhost:${process.env.PORT}/verify_email/${tomail}'><button style='background-color:cyan;margin:0px auto;border-radius: 10px;'><b>ACTIVATE</b></button></a>`,
    };

    sender.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//send mail for reset password
var reset_mail = (tomail, subject, token, req, res) => {
    console.log(process.env.PASSWORD)
    var sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    var mailOptions = {
        from: 'sandeep.verma@appventurez.com',
        to: tomail,
        subject: subject,
        html: `<h3>Please use this token for RESET your password</h3><br><h4>Token:</h4><h5>${token}</h5>`,
    };
    sender.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = { sendmail, reset_mail }