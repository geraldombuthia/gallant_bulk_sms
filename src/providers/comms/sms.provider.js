require("dotenv").config();
const axios = require("axios");
class SMSProvider {
    constructor () {

    };

    /**
     * @brief Authenticate gateway access
     * @returns a token string
     */
    getAuthToken() {
        return "token";
    }

    /**
     * 
     * @param {*} msgPayload Contains all information 
     * required to send out a successful message
     */
    async sendMessage(msgPayload) {
        console.log("SMS provider received", msgPayload);
        // sentPayload simulates a received feedback on send from gateway
        let sentPayload = {};

        try {
            // Prepare message to be sent
            const sentMessage = {
                userid: process.env.BULK_SMS_USERID,
                msg: msgPayload.message,
                mobile: msgPayload.phoneNumber,
                senderid: msgPayload.senderId,
                sendMethod: "simpleMsg",
                msgType: "text",
                output: "json"
            };

            const sentHeaders = {
                apikey: process.env.BULK_SMS_API_KEY,
            };
            // Actually send a single message to the gateway
            const response = await axios.post(process.env.BULK_SMS_SINGLE_SEND_URL, 
                sentMessage, {headers: sentHeaders});

            console.log("Response from gateway", response.data);

            // sentPayload = {
            //     status: response.data.status,
            //     statusCode: response.data.statusCode,
            //     message: response.data,
            //     message_id: "unique_message_identifier",
            //     recipient: response.data.recipient,
            //     credits_used: 1,
            //     balance_after: 99,
            //     network: "safaricom", // Important to know if this is present
            //     timestamp: "2024-12-11T14:30:45Z"
            // };
            response.data.channel = "sms";
            return response.data;
                
        } catch(error) {
            console.error("Error: ", error);
            throw new Error("Send Message failed: ", error);
        }
    }

    handleMSGCallback() {

        return {
            status: "success",
            code: 0
        };
    }
    
}

module.exports = SMSProvider;