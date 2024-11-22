const {
    parsePhoneNumberWithError,
    ParseError
} = require("libphonenumber-js");
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
    
        try {
            
            const validateNumber = parsePhoneNumberWithError(String(phoneNumber), {
                defaultCountry: "KE"
            });
            
            if (!validateNumber.isValid()) {
                throw new ParseError("Invalid phone number format");
            }
            const formatNumber = validateNumber.formatInternational()
                .replace(/^(\+)/, "")
                .replace(/\s+/g, "");
            
            // format
            if (purchaseType !== "register" && purchaseType !== "purchase") {
                throw new ParseError("Invalid purchase type");
            }

            if (typeof parseInt(amount) !== "number") {
                throw new ParseError("Invalid amount");
            }

            const providerList = this.paymentService.getSupportedProviders();
            if (!providerList.includes(provider)) {
                throw new ParseError("Unsupported provider");
            }

            if (currency !== "KE") {
                throw new ParseError("Unsupported currency");
            }
            const paymentData = {
                phoneNumber: formatNumber, // Phone to send prompt to
                amount, // Amount to be paid
                userId, // UserId of user requesting to pay
                provider, // payment provider i.e 'Mpesa'
                currency, // Currency in use i.e Kenya
                purchaseType, // Whether its a registration fee or purchase
                transaction_type, // Whether its a paybill or buy goods for safaricom use
            };

            const payment = await this.paymentService.createPayment(paymentData);

            const paymentJSON = payment.toJSON ? payment.toJSON() : payment;

            if (paymentJSON.responseCode === 0 || paymentJSON.responseCode === "0") {
                
                // eslint-disable-next-line no-unused-vars
                const {  merchantRequestID, checkoutRequestID, ...newPayment } = paymentJSON;

                return res.status(201).json({ newPayment });
            } else {
                return res.status(500).json({
                    message: payment?.message || "payment failed",
                });
            }
        } catch (error) {
            if (error instanceof ParseError) {
                console.error("Phone number validation failed:", error.message);
            } else {
                console.error("Unexpected error in phone number validation:", {
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                });
                // throw error; // Re-throw unexpected errors
            }
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
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
                console.error("Payment Data is null");
                return res.status(500).json("Payment Data is null");
            }

            if (paymentData.ResultCode === 0) {
                return res.status(200).json("Success");
            }

            return res.json("success");
        } catch (error) {
            // @TODO implement the following way of error logging
            console.error("Callback Error:", {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
            throw new Error(`Failed to get data appropriately ${error.message}`);
        }
    }
}

module.exports = new PaymentController();
