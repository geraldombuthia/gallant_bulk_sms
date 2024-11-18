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
        consumerKey + ":" + consumerSecret
      ).toString("base64");

      const headers = {
        Authorization: "Basic " + encodedCredentials,
        "Content-Type": "application/json",
      };

      const response = await axios.get(auth_url, { headers });

      return response.data.access_token;
    } catch (error) {
      throw new Error("Failed to get access token");
    }
  }

  /**
   * @brief Initiates a payment and sends out a prompt to the customer where he inputs 
   * the pin and authorizes the transaction to proceed
   * @param {numeric} amount 
   * @param {string} PhoneNumber 
   * @param {string} account_ref 
   * @param {String} transaction_type whether a paybill or a buy goods transactions
   * @returns response.data It returns the response body with results
   */
  async sendStkPush(amount, PhoneNumber, account_ref, transaction_type = "CustomerPayBillOnline") {
    const token = await genAccessToken();

    const date = new Date();

    const timeStamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const shortCode = process.env.SHORTCODE;
    const passkey = process.env.PASS_KEY;
    const callBackURL = process.env.MPESA_CALLBACK_URL;

    const stk_password = new Buffer.from(
      shortCode + passkey + timeStamp
    ).toString("base64");

    const headers = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    };

    const requestBody = {
        BusinessShortCode: shortCode,
        Password: stk_password,
        Timestamp: timeStamp,
        TransactionType: transaction_type, // till "CustomerBuyGoodsOnline"
        Amount: amount,      // Numeric
        PartyA: PhoneNumber, // Phone number sending money (Numeric) (12 digits)
        PartyB: shortCode,
        PhoneNumber: PhoneNumber, // Phone number to receive the prompt (Numeric) (12 digits)
        CallBackURL: callBackURL,
        AccountReference: account_ref, // This is similar to the account no. It identifies the transaction in your system (12 char)
        TransactionDesc: "Gallant Bulk sms subscriptions" // Additional information/comment that can be sent along with the request from your system (13 char)
    };

    try {
        const response = await axios.post(process.env.STK_PUSH_URL, requestBody, { headers });

        console.log(response);

        return response.data;
    } catch (error) {
        throw new Error("STK_PUSH: ", error);
    }
  }

  async callbackHandler() {

  }
}

module.exports = MpesaProvider;
