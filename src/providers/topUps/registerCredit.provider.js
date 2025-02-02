const { sequelize } = require("../../config/database");
const RegisterCredit = require("../../models/registerCredit.model");
class RegisterCreditService {

    /**
     * @brief Tops up the register credit
     * 
     * @param {*} userId 
     * @param {*} amount 
     * @returns the register credit object
     */
    async topUpCredit(userId, amount) {
        console.log("Top up to register", { userId, amount });

        const transaction = await sequelize.transaction();

        try {
            const [credit] = await RegisterCredit.findOrCreate({
                where: { userId },
                defaults: { isRegistered: false, registration_amount: 0 },
                lock: transaction.LOCK.UPDATE,
                transaction
            });
            // update the register credit with amount and set isRegistered to true
            const updatedRegister = await credit.update(
                {
                    isRegistered: true,
                    registration_amount: sequelize.literal(`registration_amount + ${amount}`)

                }, 
                {transaction}
            );
            await transaction.commit();
            await updatedRegister.reload();
            console.log("Updated Register", updatedRegister.dataValues);
            updatedRegister.status = "success";
            // @TODO: use updatedRegister.get{(plain: true)} instead of updatedRegister.dataValues
            return updatedRegister.dataValues;
        } catch (error) {
            await transaction.rollback();
            console.error("Failed to topup register", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            throw error;
        }
    }

    async spentCredit() {

        return {};
    }

    /**
     * Checks if one is registered
     * @returns 
     */
    async checkBalance(userId) {
        try {
            const credit = await RegisterCredit.findOne({
                where: {userId},
                lock: true
            });

            return credit.get({plain: true});
        } catch (error) {
            console.error("Failed to check register", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });

        }
        return {};
    }
}

module.exports = RegisterCreditService;