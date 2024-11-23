const CreditService = require("../service/credit.service");

class CreditsController {
    async getBalance(req, res) {

        const {userId, productType} = req.body;
        try {
            const creditService = new CreditService();

            const balance = await creditService.getBalance(userId, productType);

            console.log(balance);

            res.status(200).json({
                message: "Balance successful",
                balance
            })

        } catch (error) {

        }
    }
}

module.exports = CreditsController;