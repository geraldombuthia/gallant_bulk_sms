const Payment = require("../models/payments");
const PaymentProviderFactory = require("../providers/factory");
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
            const provider = this.providerFactory.getProvider("mpesa");
            const account_ref = accountRefGen(serviceID, paymentData.userId);
            paymentData.accountRef = account_ref;

            const providerPayment = await provider.sendStkPush(paymentData);

            const payment = new Payment({
                merchantRequestID: providerPayment?.MerchantRequestID,
                checkoutRequestID: providerPayment?.CheckoutRequestID,
                responseCode: providerPayment?.ResponseCode,
                responseDescription: providerPayment?.ResponseDescription,
                payment_method: paymentData.provider,
                amount: paymentData.amount,
                transactionStatus: "pending",
                currency: paymentData.currency,
                userId: paymentData.userId,
                phone: paymentData.phone,
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

            if (paymentData.responseCode === 0) {
                const updatedTransaction = await Payment.update(
                    {
                        transaction_status: "success",
                        transaction_code: paymentData.MpesaReceiptNumber,
                        transactionDate: paymentData.transactionDate,
                        responseDescription: paymentData.ResultDesc,
                        responseCode: paymentData.ResultCode,
                        amount: paymentData.Amount
                    },
                    {
                        where: {
                            merchantRequestID: paymentData.MerchantRequestID,
                            checkoutRequestID: paymentData.CheckoutRequestID
                        },
                    });
                // @TODO introduce the SMS count service to update the number of SMS's 
                // or registration status here
                console.log(`Updated Transaction${  updatedTransaction}`);
                return updatedTransaction; // Return the update transaction details

            } else {
                // Handle failed payment scenario
                const failedTransaction = await Payment.update(
                    {
                        status: "failed",
                        resultDesc: paymentData.ResultDesc,
                        responseCode: paymentData.ResponseCode
                    }, 
                    {
                        where: {
                            merchantRequestID: paymentData.MerchantRequestID,
                            checkoutRequestID: paymentData.CheckoutRequestID,
                        }
                    });
                console.log(failedTransaction);
                return failedTransaction; // Returns the updated failed transaction details
            }

        } catch (error) {
            throw new Error(`Error processing Mpesa callback: ${  error.message}`);
        }
    }
}

module.exports = PaymentsService;