const CreditService = require("../service/credit.service");

class CreditsController {
    constructor() {
        this.creditService = new CreditService();
        this.getBalance = this.getBalance.bind(this);
    }
    async getBalance(req, res) {

        const {userId, productType} = req.query;

        console.log(req.query);
        try {

            const balance = await this.creditService.getBalance(userId, productType);

            console.log(balance);

            return res.status(200).json({
                message: "Balance fetched successfully",
                balance
            });

        } catch (error) {
            console.log("Failed to get Balance", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            return res.status(500).json({
                message: "Failed to get balance",
            });
        }
    }
}

module.exports = new CreditsController();