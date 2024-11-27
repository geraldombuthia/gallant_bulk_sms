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
        console.log(msgPayload);
        return {
            message: "Successfully added to queue",
            status: "Pending",
            code: 0
        };
    }

    handleMSGCallback() {

        return {
            status: "success",
            code: 0
        };
    }
    
}

module.exports = SMSProvider;