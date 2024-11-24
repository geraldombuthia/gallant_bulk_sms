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
    sendSMS(msgPayload) {
        console.log(msgPayload);
        return {
            message: "Successfully added to queue",
            status: "Pending",
            code: 0
        };
    }

    handleSMSCallback() {

        return {
            status: "success",
            code: 0
        };
    }
    
}

module.exports = SMSProvider;