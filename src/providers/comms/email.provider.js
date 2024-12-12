const sendMail = require ("./nodemailer.provider.js");

class EmailProvider {
    constructor() {

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
        try {
            console.log("Sending Message through Email Provider", msgPayload);
            const response = await sendMail(msgPayload);
            // await sendMail();

            console.log("Email provider response", response);
            return {
                message: "Successfully added to queue",
                status: "success",
                code: 0
            };
        } catch(error) {
            throw new Error("Email sending Email Error: ", error);
        }
    }

    handleMSGCallback() {

        return {
            status: "success",
            code: 0
        };
    }
}

module.exports = EmailProvider;