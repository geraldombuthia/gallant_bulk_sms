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

            console.log(Payment);
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
            console.log("Testing callback");
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
                console.error("No matching transaction found");
                return null;
            }
            // @TODO
            // If "success" or "failed" status do not update prevents overwriting
            // If already finalized code
            if (existingTransaction.transaction_status === "success" ||
                existingTransaction.transaction_status === "failed"
            ) {
                return existingTransaction.dataValues;
            }
            if (paymentData.ResultCode === 0) {
                // Handle successfull payment
                existingTransaction.transaction_status = "success",
                existingTransaction.transaction_code = paymentData.MpesaReceiptNumber,
                existingTransaction.transactionDate = String(paymentData.TransactionDate),
                existingTransaction.responseDescription = paymentData.ResultDesc,
                existingTransaction.responseCode = "0",
                existingTransaction.amount = Number(paymentData.Amount);

                const savedTransaction = await existingTransaction.save();
                // Call the CreditService
                const credit = await CreditService();

                await credit.createTransaction(savedTransaction.dataValues);
                console.log("Here are the savedTransactions", savedTransaction.dataValues);
                return savedTransaction.dataValues;
                // @TODO introduce the SMS count service to update the number of SMS's 
                // or registration status here
                
            } else {
                // Handle failed payment
                // ResponseCode is always 1032 if failed
                existingTransaction.transaction_status = "failed";
                existingTransaction.responseDescription = paymentData.ResultDesc;
                existingTransaction.responseCode = "1032";

                const failedTransactions = await existingTransaction.save();

                const credit = new CreditService();
                const credited = {
                    userId: existingTransaction.userId,
                    paymentId: existingTransaction.id,
                    value: existingTransaction.amount,
                    product: existingTransaction.purchaseType,
                };
                await credit.createTransaction(credited);
                return failedTransactions.dataValues;
            }

        } catch (error) {
            throw new Error(`Error processing Mpesa callback: ${  error.message}`);
        }
    }
}

module.exports = PaymentsService;