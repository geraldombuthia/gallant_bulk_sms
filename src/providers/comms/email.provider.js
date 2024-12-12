const sendMail = require ("./nodemailer.provider.js");

/**
 * @brief
 * Below is the cost of sending emails on AMAzon SES
 * Sending Emails $0.10 for every 1000emails or every recipient
 * Outgoing data $0.12 per GB of data in attachments i.e. headers,
 * message content and attachments
 * Incoming mail chunks $0.09 for every 1000 incoming mail chunks.
 * 1 mail chunk is 256KB of incoming data.
 * Do not use Gmail for bulk email
 */
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
            // console.log("Sending Message through Email Provider", msgPayload);
            const response = await sendMail(msgPayload);
            // await sendMail();

            console.log("Email provider response", response);
            return {
                status: "success",
                ...response
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