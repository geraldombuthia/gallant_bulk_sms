const Payment = require("../models/payments");
const PaymentProviderFactory = require("../providers/factory");
const CreditService = require("./credit.service");
const {accountRefGen, serviceID} = require("../utils/accountRefGen");

/**
 * @brief This class handles the payment methods for the 
 * Bulk sms service. 
 * Main payment method is mpesa, will however implement other methods as time goes by
 */
class PaymentsService {
    constructor() {
        this.providerFactory = new PaymentProviderFactory();
        this.finalStatuses = ["success", "failed"];
    }

    async createPayment(paymentData) {
        // provider, transactional information

        try {
            const provider = this.providerFactory.getProvider(paymentData.provider);
            const account_ref = accountRefGen(serviceID, paymentData.userId); 
            
            paymentData.account_ref = account_ref;

            const providerPayment = await provider.sendStkPush(paymentData);

            const payment = new Payment({
                merchantRequestID: providerPayment?.MerchantRequestID,
                checkoutRequestID: providerPayment?.CheckoutRequestID,
                responseCode: providerPayment?.ResponseCode,
                responseDescription: providerPayment?.ResponseDescription,
                payment_method: paymentData.provider,
                amount: paymentData.amount,
                transaction_status: "pending",
                currency: paymentData.currency,
                userId: paymentData.userId,
                phone: paymentData.phoneNumber,
                purchaseType: paymentData.purchaseType
            }); 
            /**
             * In the above the following will be missing as we wait 
             * for the call back to be recieved
             *  * Transaction code
             *  * Transaction status
             *  * Transaction Date
             *  * New Response Codes and Descriptions
             */
            await payment.save();

            console.log("Payment Created successfully", Payment);
            return payment;
        } catch (error) {
            throw new Error(`Payment Service Error: ${ error.message}`);
        }
        
    }
    /**
     * This function will be implemented to perform Refunds on payment that need
     * to be refunded
     * @param {INT} paymentId 
     */
    // async refundPayment(paymentId) {
    //     // @TODO implement the refund processes
    // }

    getSupportedProviders() {
        return this.providerFactory.getSuppotedProviders();
    }

    async checkPaymentStatus() {

    }

    async handlePaymentCallback(callbackData, pay_provider) {
        try {
            const provider = this.providerFactory.getProvider(pay_provider);

            if (!provider) {
                throw new Error("Payment provider not initiated");
            }

            const paymentData = await provider.callbackHandler(callbackData);

            const existingTransaction = await Payment.findOne({
                where: {
                    merchantRequestID: paymentData.MerchantRequestID,
                    checkoutRequestID: paymentData.CheckoutRequestID
                }
            });

            if (!existingTransaction) {
                console.error("No matching transaction found", {
                    merchantRequestID: paymentData.MerchantRequestID,
                    checkoutRequestID: paymentData.CheckoutRequestID
                });
                return null;
            }

            // Prevent overwrite on completion of the transaction
            if (this.finalStatuses.includes(existingTransaction.transaction_status)) {
                return existingTransaction.dataValues;
            }
            if (paymentData.ResultCode === 0) {
                // Handle successfull payment
                Object.assign(existingTransaction, {
                    transaction_status: "success",
                    transaction_code: paymentData.MpesaReceiptNumber,
                    transactionDate: String(paymentData.TransactionDate),
                    responseDescription: paymentData.ResultDesc,
                    responseCode: "0",
                    amount: Number(paymentData.Amount)
                });

                const savedTransaction = await existingTransaction.save();

                // Process Credits
                const credit = await new CreditService();

                const creditData = await credit.createTransaction({
                    userId: existingTransaction.userId,
                    paymentId: existingTransaction.id,
                    creditsValue: existingTransaction.amount,
                    product: existingTransaction.purchaseType,
                });
                console.log("This is the credit Data",creditData);

                return savedTransaction.dataValues;
            } else {
                // Process Failed payment
                Object.assign(existingTransaction, {
                    transaction_status: "failed",
                    responseDescription: paymentData.ResultDesc,
                    responseCode: "1032"
                });

                const failedTransactions = await existingTransaction.save();

                console.log("Payment failed", {
                    transactionId: failedTransactions.id,
                    reason: paymentData.ResultDesc
                });

                return failedTransactions.dataValues;
            }

        } catch (error) {
            console.log("Payment callback processing failed", {
                error: error.message,
                provider: pay_provider,
                stack: error.stack
            });

            throw new Error(`Error processing ${pay_provider} callback: ${  error.message}`);
        }
    }
}

module.exports = PaymentsService;