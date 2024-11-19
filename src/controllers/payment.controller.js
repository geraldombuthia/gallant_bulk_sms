const PaymentService = require("../service/payments.service");

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
        this.createPayment = this.createPayment.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
    }

    async createPayment(req, res) {
    // purchaseType indicates whether this is a registration or a purchase
        const { 
            phoneNumber, 
            amount, 
            provider, 
            currency, 
            purchaseType 
        } = req.body; // Contains phonenumber, provider and amount
        const userId = 1; // To be confirmed
        const transaction_type = "CustomerPayBillOnline";

        /**
     * @TODO we need to validate the paymentbody for the following
     * * Phone number is appropriate format
     * * Amount value is a number
     * * TransactionType is one of two
     * * Account_ref is well generated and set
     *   - this will be a unique identifier of a user
     */
        const paymentData = {
            phoneNumber, // Phone to send prompt to
            amount, // Amount to be paid
            userId, // UserId of user requesting to pay
            provider, // payment provider i.e 'Mpesa'
            currency, // Currency in use i.e Kenya
            purchaseType, // Whether its a registration fee or purchase
            transaction_type, // Whether its a paybill or buy goods for safaricom use
        };
        console.log(paymentData);
        try {
            // console.log(this.paymentService);
            const payment = await this.paymentService.createPayment(paymentData);

            console.log(`Raw Payment response ${  payment}`);

            const paymentJSON= payment.toJSON? payment.toJSON(): payment;

            console.log("Payment Response as an Object", paymentJSON);

            if ( paymentJSON.responseCode === 0) {
                
                return res.status(201).json({payment});
            } else {
                return res.status(500).json({
                    message: payment?.message || "payment failed",
                });
            }
        } catch (error) {
            console.error("Error in createPayment:", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    async handleCallback(req, res) {
        try {
            const pay_provider = "mpesa";
            const paymentData = await this.paymentService.handlePaymentCallback(
                req.body,
                pay_provider
            );
            if (!paymentData) {
                throw new Error("HandlePaymentCallback failed");
            }
            if (paymentData.ResultCode === 0) {
                res.status(200).json("Success");
            }

            return res.json("success");
        } catch (error) {
            // @TODO implement the following way of error logging
            console.error("Callback Error:",  {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to get data appropriately ${error.message}`);
        }
    }
}

module.exports = new PaymentController();
