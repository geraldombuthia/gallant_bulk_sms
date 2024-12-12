#!/usr/bin/env node

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: "geraldombuthia@gmail.com",
        pass: "cbwb ytkx emva tlou"
    },
});

async function sendEmail(msgPayload) {
    console.log("Send Email here", msgPayload);
    try {
        const info = await transporter.sendMail({
            from: msgPayload.sender, // sender Address
            to: JSON.parse(msgPayload?.recipient)?.to, // list of receivers
            bcc: JSON.parse(msgPayload?.recipient)?.bcc,
            cc: JSON.parse(msgPayload?.recipient)?.cc,
            subject: msgPayload.subject,
            text: msgPayload?.textBody, // plain text body
            html: msgPayload?.htmlBody
        });
        console.log("This is the nodemailer ",info);
        return {
            response: info.response,
            messageId: info.messageId,
            info
        };
    } catch (error) {
        throw new Error(`Transporter Error on Nodemailer ${error.message}`);
    }
}
// sendEmail();
module.exports = sendEmail;