const Credit = require("../models/credits.model");
const SMSCreditService = require("../service/smsCredits.service");
const CreditHandlerFactory = require("../providers/topUps/factory");

class CreditService {
    pricePerUnit = 0.7;
    /**
     * @brief Creates a transaction to be stored to 
     * keep track of the purchase order value, units
     * purchased and payment id
     * @param {Object} purchaseObj 
     * @returns 
     */
    async createTransaction(purchaseObj) {
        try {
            const transaction = new Credit({
                userId: purchaseObj.userId,
                paymentId: purchaseObj.paymentId,
                creditsValue: purchaseObj.value,
                productType: purchaseObj.product,
                creditUnit: (purchaseObj.creditsValue / this.pricePerUnit)
            });
    
            const saved = await transaction.save(); // Check for errors?

            // Handle the various products
            const creditProvider = new CreditHandlerFactory().getProvider("sms");

            const productTopUp = await creditProvider.topUpCredit(
                saved.userId, 
                saved.creditsValue
            );

            console.log("Product Top Up", productTopUp.dataValues);

            console.log("Transaction on the CreateTransaction", saved.id);
            return saved;
        } catch (error) {
            console.error("Transaction Error", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
        }
    }; 

    async offersAndPromotions() {
        // Unsure what to do
    }

    async spentMsgCredit(usedCredit, userId, product) {

    }

    async getBalance(userId, productType) {
        const creditProvider = new CreditHandlerFactory();

        const provider = creditProvider.getProvider(productType);

        const balance =  await provider.checkSMSBalance(userId);

        console.log(balance);
        return balance;
    }

}

module.exports = CreditService;