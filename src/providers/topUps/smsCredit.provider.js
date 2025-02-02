const { sequelize } = require("../../config/database");
const SMSCredit = require("../../models/smsCredits.model");

class SMSCreditService {
    async topUpCredit(userId, newCredits) {

        console.log("Value of new Credits",newCredits);
        
        const transaction =  await sequelize.transaction();
        try {
            const [credit] = await SMSCredit.findOrCreate({
                where: { userId },
                defaults: { creditBalance: 0 }, // Remove the unused variable assignment
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            const updatedCredit = await credit.increment("creditBalance", {
                by: newCredits,
                transaction
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
            // console.log("The returned credit is ", credit.dataValues);
            if (!credit || credit.creditBalance < usedCredit ) {
                // return Insufficient credits instead
                throw new Error("Insufficient credits");
            }

            const updatedCredit = await credit.decrement("creditBalance", {
                by: usedCredit,
                transaction,
                returning: true
            });

            await transaction.commit();
            await updatedCredit.reload();
            return {
                credit,
                creditBalance: updatedCredit.creditBalance
            };

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
                // attributes: ["creditBalance"], // Only fetch the balance field
                lock: true // Consider not using for less critical checks
            });

            if (!creditBalance) {
                // @TODO: Introduce a return for the creditBalance using .get({plain: true})
                return {
                    userId,
                    creditBalance: 0
                };
            }

            return creditBalance.get({ plain: true });
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