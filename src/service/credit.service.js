const Credit = require("../models/credits.model");
const CreditHandlerFactory = require("../providers/topUps/factory");

const RoundDownUtil = require("../utils/roundDown");

/**
 * @brief This class handles Crediting services
 * Will handle conversion of payments into Credit units
 */
class CreditService {

    constructor() {

    }
    pricePerUnit = 0.7;
    /**
     * @brief Creates a transaction to be stored to 
     * keep track of the purchase order value, units
     * purchased and payment id
     * @param {Object} purchaseObj 
     * @returns 
     */
    async createTransaction(purchaseObj) {
        console.log("PurchaseObj",purchaseObj)
        try {
            const transaction = new Credit({
                userId: purchaseObj.userId,
                paymentId: purchaseObj.paymentId,
                creditsValue: purchaseObj.creditsValue,
                productType: purchaseObj.product,
                creditUnit: RoundDownUtil(purchaseObj.creditsValue / this.pricePerUnit)
            });
    
            const saved = await transaction.save(); // Check for errors?
            console.log("Transaction values", saved);
            // Handle the various products
            const creditProvider = new CreditHandlerFactory().getProvider(purchaseObj.product);

            const productTopUp = await creditProvider.topUpCredit(
                saved.userId, 
                saved.creditUnit
            );

            console.log("Product Top Up", productTopUp);
            // Handle and Object.assign() to update saved information
            console.log("Transaction on the CreateTransaction", saved);
            let creditObj = {};

            Object.assign(creditObj, {
                userId: productTopUp.userId,
                creditBalance: productTopUp.creditBalance,
                paymentId: saved.paymentId,
                productType: saved.productType,
                creditsValue: saved.creditsValue
            });

            console.log(creditObj);
            return creditObj;
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