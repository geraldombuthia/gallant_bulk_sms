const SMSCreditService = require("../topUps/smsCredit.provider");
const EmailCreditService = require("../topUps/emailCredit.provider");
const RegisterCreditService = require("../topUps/registerCredit.provider");
class CreditHandlerFactory {
    constructor() {
        this.providers = {
            sms: new SMSCreditService(),
            email: new EmailCreditService(),
            register: new RegisterCreditService(),
            // donate: new DonateCreditService()
        };
    }

    getProvider(providerName) {
        const provider = this.providers[providerName];
        
        console.log(`Provider Name is ${providerName}`);
        if (!provider) {
            throw new Error("The product ${providerName} is not supported");
        }

        return provider;
    }

    getSupportedProduct() {
        return Object.keys(this.providers);
    }
}

module.exports = CreditHandlerFactory;