const AuthService = require("../service/auth.service.js");
const MessageService = require("../service/message.service");
const {formatToIntNumber} = require("../utils/formatInternational.js");

class APIController {

    constructor() {
        this.MessageService = new MessageService();
        this.sendSMS = this.sendSMS.bind(this);

    }
    async sendSMS(req, res) {

        try {
            const { message, phoneNumber} = req.body;
            const apiKey = req.headers["x-api-key"];

            console.log("These are the headers",req.headers);

            console.log(req.body);

            if (message === undefined || phoneNumber === undefined) {
                return res.status(400).json({
                    message: "Invalid input",
                });
            }

            if (apiKey === undefined) {
                return res.status(401).json({
                    message: "API Key is required. Set in headers as x-api-key",
                });
            }

            const formatNumber = formatToIntNumber(phoneNumber); // format phone number
            // Input validation methods
            // @TODO: Introduce method to check actual message to ensure
            // No spamming, or malicious content
            // @TODO Introduce a validate user's api key mechanism/ service
            const isValidAPIKey = await AuthService.validateAPIKey(apiKey);
            
            if (!isValidAPIKey) {
                return res.status(401).json({
                    message: "Invalid API Key",
                });
            }

            if (!isValidAPIKey.registered_at) {
                return res.status(401).json({
                    message: "User not registered to use service",
                });
            }

            // @TODO: Implement a method to check if user has enough credits
            // to send a message

            // pass message to Message Service
            const result = await this.MessageService.sendMessage({
                phoneNumber: formatNumber, 
                country: "KE",
                message,
                userId: isValidAPIKey.id,
                senderId: process.env.SENDER_ID,
                channel: "sms"
            });
            console.log(`Sending SMS to ${phoneNumber} with message: ${message}`);
            console.log("This is the result",result);

            // @TODO: Implement a way to send a response based on the sent message
            res.status(200).json({
                status: result.status,
                statusCode: result.statusCode,
                message: result.message,
            });
        } catch (error) {
            console.error("Sending SMS failed:", error);

            return res.status(500).json({
                message: "Sending SMS failed",
            });
        }
    }
}

module.exports = new APIController();

/**
 * For GSM 7-bit encoding: Each message part can be up to 153 characters long 
 * (because 7 bits are used per character instead of 8 bits). 
 * The total maximum length for concatenated messages can be up to 1,600 
 * characters (using 10 parts).
 * For UCS2 encoding: Each message part can be up to 67 characters long, 
 * with a total of 4 parts for a maximum length of 268 characters.
 */