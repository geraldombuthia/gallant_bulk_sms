const { sequelize } = require("../config/database");
const SMSCredit = require("../models/smsCredits.model");

class SMSCreditService {
    async topUpCredit(userId, newCredits) {
        
        const transaction =  await sequelize.transaction();
        try {
            const [credit, wasCreated] = await SMSCredit.findOrCreate({
                where: { userId },
                defaults: { creditBalance: 0 },
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            const updatedCredit = await credit.increment("creditBalance", {
                by: newCredits,
                transaction,
                returning: true
            });

            await transaction.commit();
            await updatedCredit.reload();
            console.log("Updated Credits", updatedCredit.dataValues);
            return updatedCredit.dataValues;

        } catch (error) {
            await transaction.rollback();
            console.error("Failed to topup credit",  {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            throw error;
        }
    }
    /**
     * Decrements the spent sms credits
     * @param {number} usedCredit 
     * @param {number} userId 
     * @returns credit object
     */
    async spentCredit(usedCredit, userId) {
        const transaction = await sequelize.transaction();

        try {
            const credit = await SMSCredit.findOne({
                where: {userId},
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!credit || credit.creditBalance < usedCredit ) {
                throw new Error("Insufficient credits");
            }

            await credit.decrement("creditBalance", {
                by: usedCredit,
                transaction
            });

            await transaction.commit();
            console.log("Second", credit);
            return credit;

        } catch (error) {
            await transaction.rollback();
            console.error("Failed to topup credit",  {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            throw error;
        }
    }

    async checkBalance(userId) {
        try {
            const creditBalance = await SMSCredit.findOne({
                where: { userId },
                attributes: ["creditBalance"], // Only fetch the balance field
                lock: true // Consider not using for less critical checks
            });

            return creditBalance? creditBalance: 0; // Return just value or obj
        } catch(error) {
            console.error("Failed to fetch credit balance",{
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            throw error;
        }
    }
}

module.exports = SMSCreditService;