require("dotenv").config();

const axios = require("axios");

/**
 * @brief Implements the Mpesa payment strategy here
 * 
 */
class MpesaProvider {
    /**
     * @brief Gets access token from DARAJA API Authorization endpoint
     * @returns access_token
     */
    async getAccessToken() {
        const consumerKey = process.env.CONSUMER_KEY;
        const consumerSecret = process.env.CONSUMER_SECRET;

        const auth_url = process.env.AUTH_URL;

        try {
            const encodedCredentials = new Buffer.from(
                `${consumerKey  }:${  consumerSecret}`
            ).toString("base64");

            const headers = {
                Authorization: `Basic ${  encodedCredentials}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(auth_url, { headers });

            return response.data.access_token;
        } catch (error) {
            throw new Error(`Failed to get Access token: ${  error.message}` );
        }
    }

    /**
   * @brief Initiates a payment and sends out a prompt to the customer where he inputs 
   * the pin and authorizes the transaction to proceed
   * @param {Object} Payment Data which contains
   * @param {numeric} amount 
   * @param {string} PhoneNumber 
   * @param {string} account_ref 
   * @param {String} transaction_type whether a paybill or a buy goods transactions
   * @returns response.data It returns the response body with results
   */
    async sendStkPush(paymentData) {
        const { amount, 
            phoneNumber, 
            account_ref, 
            transaction_type = "CustomerPayBillOnline"} = paymentData;
        console.log(account_ref);
        const token = await this.getAccessToken();

        const date = new Date();

        const timeStamp =
      date.getFullYear() +
      (`0${  date.getMonth() + 1}`).slice(-2) +
      (`0${  date.getDate()}`).slice(-2) +
      (`0${  date.getHours()}`).slice(-2) +
      (`0${  date.getMinutes()}`).slice(-2) +
      (`0${  date.getSeconds()}`).slice(-2);

        const shortCode = process.env.SHORT_CODE;
        const passkey = process.env.PASS_KEY;
        const callBackURL = process.env.MPESA_CALLBACK_URL;

        const stk_password = new Buffer.from(
            shortCode + passkey + timeStamp
        ).toString("base64");

        const headers = {
            "Authorization": `Bearer ${ token}`,
            "Content-Type": "application/json"
        };
        
        const requestBody = {
            BusinessShortCode: shortCode,
            Password: stk_password,
            Timestamp: timeStamp,
            TransactionType: transaction_type, // till "CustomerBuyGoodsOnline"
            Amount: amount,      // Numeric
            PartyA: phoneNumber, // Phone number sending money (Numeric) (12 digits)
            PartyB: shortCode,
            PhoneNumber: phoneNumber, // Phone number to receive the prompt (Numeric) (12 digits)
            CallBackURL: callBackURL,
            AccountReference: "Geralds", 
            // Account no. Identifies transaction in your system (12 char)
            TransactionDesc: "Gallant Bulk sms subscriptions" 
            // Additional info sent along with the request from your system (13 char)
        };

        try {
            const response = await axios.post(process.env.STK_PUSH_URL, requestBody, { headers });

            console.log(response.data);

            return response.data;
        } catch (error) {
            throw new Error(`STK_PUSH: ${ error.message}`);
        }
    }

    /**
   * @brief Performs processing of data sent through the callback
   * @param {Object} request Contains req.body data sent from MPESA containing info partaining
   * to a payment request
   * @return data object with transaction information
   */
    async callbackHandler(request) {
        const callback = request?.Body?.stkCallback;
        console.log(callback);

        if (!callback) {
            throw new Error("Invalid callback data");
        }
        const transformData = (data, obj) => {
            if (data.Item) {
                return data.Item.reduce((acc, item) => {
                    acc[item.Name] = item.Value || null;
                    return acc;
                }, obj);
            }
            return obj;
        };
        // Base Response Object
        const obj = {
            "MerchantRequestID": callback?.MerchantRequestID,
            "CheckoutRequestID": callback?.CheckoutRequestID,
            "ResultCode": callback?.ResultCode,
            "ResultDesc": callback?.ResultDesc
        };

        if (callback.ResultCode === 0 && callback.CallbackMetadata) {
            return transformData(callback.CallbackMetadata, obj);
        }
        return obj;
    }

    // async checkPaymentStatus(requestID) {
    // // @TODO implement the method that queries mpesa to get status
    // // of a method using an endpoint

    // }
}

module.exports = MpesaProvider;
