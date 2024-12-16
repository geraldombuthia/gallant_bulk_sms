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
    pricePerEmailUnit = 0.0001; // Email
    pricePerSMSUnit = 0.8; // SMS
    /**
     * @brief Creates a transaction to be stored to 
     * keep track of the purchase order value, units
     * purchased and payment id
     * @param {Object} purchaseObj 
     * @returns 
     */
    async createTransaction(purchaseObj) {
        console.log("Create Transaction", purchaseObj, purchaseObj.product);
        try {
            const rate = (purchaseObj.product === "email") ? 
                this.pricePerEmailUnit : this.pricePerSMSUnit;
            const pricePerUnit = Number((purchaseObj.product === "email") ? 
                this.pricePerEmailUnit : this.pricePerSMSUnit);
       
            const transaction = new Credit({
                userId: purchaseObj.userId,
                paymentId: purchaseObj.paymentId,
                creditsValue: purchaseObj.creditsValue,
                productType: purchaseObj.product,
                creditUnit: RoundDownUtil(purchaseObj.creditsValue / rate),
                price_per_unit: pricePerUnit
            });
       
            const saved = await transaction.save();
            console.log("Transaction Saved", saved);
       
            // Explicitly update price_per_unit if not set correctly
            if (saved.price_per_unit !== 0.008) {
                await Credit.update(
                    { price_per_unit: pricePerUnit },
                    { where: { id: saved.id } }
                );
                console.log("Explicitly updated price_per_unit");
            }
       
            // Rest of the code remains the same...
        } catch (error) {
            console.error("Transaction Error", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
        }
    }
    async offersAndPromotions() {
        // Unsure what to do
    }

    async spentMsgCredit() {

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