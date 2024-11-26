const { sequelize } = require("../../config/database");
const EmailCredit = require("../../models/emailCredit.model");

class EmailCreditService {
    async topUpCredit(userId, newCredits) {
        const transaction = await sequelize.transaction();
        try {
            const [credit] = await EmailCredit.findOrCreate({
                where: { userId },
                defaults: { creditBalance: 0},
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
            // console.log("Updated Credits", updatedCredit.dataValues);
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

    async spentCredit(usedCredit, userId) {
        const transaction = await sequelize.transaction();

        try {
            const credit = await EmailCredit.findOne({
                where: { userId },
                lock: transaction.LOCK.UPDATE,
                transaction
            });
            const balance = parseFloat(credit.creditBalance);
        
            if (!credit || isNaN(balance) || credit.creditBalance < usedCredit) {
                throw new Error("Insufficient credits");
            }

            await credit.decrement("creditBalance", {
                by: usedCredit,
                transaction
            });

            await transaction.commit();

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
            const creditBalance = await EmailCredit.findOne({
                where: { userId },
                attributes: ["creditBalance"],
                lock: true
            });

            return creditBalance;
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

module.exports = EmailCreditService;