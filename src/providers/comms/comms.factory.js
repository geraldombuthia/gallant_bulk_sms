const SMSProvider = require("./sms.provider");
const EmailProvider = require("./email.provider");

/**
 * @brief This instantiates comms objects dynamically passed.
 * Allows scalability and reusability
 */

class CommsProviderFactory{
    // @TODO Consider passing provider thru
    // Constructor during instantiation
    constructor() {
        this.providers = {
            sms: new SMSProvider(),
            email: new EmailProvider()
        };
    }
    /**
     * @brief Allows setting of the desired comms provider
     * 
     * @param {*} providerName 
     * @returns instance of provider
     */
    getCommsProvider(providerName) {
        const provider = this.providers[providerName.toLowerCase()];

        if (!provider) {
            throw new Error("Comms provider ${providerName} no supported");
        }
        return provider;
    }

    /**
     * @brief provides a way to access supported providers
     * @returns a list of supported providers
     */
    getSupportedProviders() {
        return Object.keys(this.providers);
    }
}