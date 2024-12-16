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
        console.log("SMS provider received",msgPayload);

        try {
            // sentPayload simulates a received feedback on send from gateway
            const sentPayload = {
                status: "success",
                message_id: "unique_message_identifier",
                recipient: "+254728127853",
                credits_used: 1,
                balance_after: 99,
                network: "safaricom", // Important to know if this is present
                timestamp: "2024-12-11T14:30:45Z"
            };

            return sentPayload;
        } catch(error) {
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