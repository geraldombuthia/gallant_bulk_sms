const Users = require('../models/users');
const RegisterCredit = require('../models/registerCredit.model'); // To be implemented

// Services
const CreditService = require('./credit.service');
const MessageService = require('./message.service');
const PaymentService = require('./payments.service');

const { sequelize } = require('../config/database');


class DashboardService {
    constructor() {

    }

    async getUserDetails(userId) {
        try {
            const user = await Users.findOne({ where: { id: userId } });

            if (!user) {
                throw new Error("User not found");
            }
            const plainUser = user.get({ plain: true });
            // const sanitizedUser = {password, ...plainUser};
            return plainUser;
        } catch (error) {
            throw error;
        }
    }

    async getOverviewData(userId) {
        const creditService = new CreditService();
        const messageService = new MessageService();
        const paymentService = new PaymentService();
        try {
            const [
                user,
                credits,
                messages,
                payments
            ] = await Promise.all([
                this.getUserDetails(userId),
                creditService.getBalance(userId, ),
                messageService.getMessageHistory(userId),
                paymentService.getPayments(userId)
            ]);

            console.log("Overview data as clean", {
                user,
                credits,
                messages,
                payments
            });

            return {
                user,
                credits,
                messages,
                payments
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DashboardService;