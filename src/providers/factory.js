const MpesaProvider = require("./mpesa.provider");

/**
 * @brief This creates payments methods instantiations based on 
 * what is passed down to it.
 * Improves flexibility and reusability
 */
class PaymentProviderFactory {
    constructor() {
        console.log("Payment started");
        this.providers = {
            mpesa: new MpesaProvider(),
        };
    }
    /**
     * This function returns a provider instanced based on passed in provider name
     * Serves to ensure scalability of payment providers and methods
     * @param {ObjectConstructor} providerName [mpesa]
     * @returns 
     */
    getProvider(providerName) {
        const provider = this.providers[providerName.toLowerCase()];

        // console.log(provider);
        if (!provider) {
            throw new Error(`Payment provider ${providerName} not supported`);
        }
        return provider;
    }
    /**
     * This seeks to provide a way to add Providers at runtime
     * Not found necessary at time of writing this cose
     * @param {String} name 
     * @param {ObjectConstructor} provider 
     */
    // addProvider(name, provider) {

    // }
    
    /**
     * This returns all supported providers
     */
    getSuppotedProviders() {
        return Object.keys(this.providers);
    }
}

module.exports = PaymentProviderFactory;