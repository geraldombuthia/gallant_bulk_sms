#!/usr/bin/env node

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: "geraldombuthia@gmail.com",
        pass: "cbwb ytkx emva tlou"
    },
});

async function sendEmail() {
    try {
        const info = await transporter.sendMail({
            from: '"Gerald Mbuthia"geraldombuthia@gmail.com', // sender Address
            to: "geraldombuthia@gmail.com", //list of receivers
            subject: "Hello, Testing  again",
            text: "Hello World?", //plain text body
            html: "<b>Hello world?</b>"
        });
        console.log(info);
        return {
            response: info.response,
            messageId,
            accepted,
            rejected
        };
    } catch (error) {
        throw new Error(`Transporter Error on Nodemailer ${error.message}`);
    }
}
sendEmail();
// module.exports = sendEmail;