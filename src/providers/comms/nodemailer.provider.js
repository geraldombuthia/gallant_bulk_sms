#!/usr/bin/env node
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
    },
    pool: true, // Enable connection pooling
    maxConnections: 10, // Max concurrent conenctions
    maxMessages: 100, // Max messages per connection
    rateDelta: 1000, // Rate Limiting: time window
    rateLimit: 5 // Max emails per time widnow
});

async function sendEmail(msgPayload) {
   
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
        
        return {
            response: info.response,  // 250(succesful command completion) 
            // 2.0.0(successful transmission) OK(confirms email accepted by server) success response
            // 550(Permanently rejected i.e user Unknown)
            messageId: info.messageId, // Globally Unique identify for this email
            accepted: info.accepted, // List of addresses that accepted delivery
            rejected: info.rejected, // List of addresses that rejected
            envelope: info.envelope, // To and From addresses
            ehlo: info.ehlo,         // Supported capabilities 
            messageTime: info.messageTime, //time to process message (ms)
            messageSize: info.messageSize, // Size of email
            envelopeTime: info.envelopeTime // time to process the email envelope
        };
    } catch (error) {
        throw new Error(`Transporter Error on Nodemailer ${error.message}`);
    }
}
// sendEmail();
module.exports = sendEmail;