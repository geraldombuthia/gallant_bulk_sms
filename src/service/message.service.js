const MessageProviderFactory = require("../providers/comms/comms.factory");
const CreditHandlerFactory = require("../providers/topUps/factory");
const SMSModel = require("../models/smsMsg.model");
const EmailModel = require("../models/emailMsg.models");

/**
 * @brief Handles Message transfer using the available 
 * Message providers
 */
class MessageService {
    constructor () {
        this.provider = new MessageProviderFactory();
        this.storageModels = {
            sms: SMSModel,
            email: EmailModel
        }
        this.billing = new CreditHandlerFactory()
    }

    async sendMessage(msgPayload) {
        try {
            const { channel, ...msgPayload } = msgPayload;

            const provider = this.provider.getCommsProvider(channel);

            if (!provider) {
                throw new Error ("Message provider ${providerName} not supported");
            }
            // Consider sending a message with a callback attached to store and bill
            // useful while working with other similar services i.e notifications
            const providerResponse = await provider.sendMessage(
                msgPayload, 
                (msgPayload)=> this.models[channel].create(msgPayload), 
                (userId, credits) => this.billing.getProvider(channel).spentCredit(userId, credits)
            );
            // Message store will happen in the provider layer
            console.log(providerResponse);
            // On success we will bill from here

            return providerResponse;
        } catch (error) {
            console.error("Message sending failed")
            throw new Error("Message send failed with $providerName failed");
        }
    }
    async storeMessages(message) {

    }

    async billMessageCredits(user, messageCount) {

    }

    validateMessage(messageData) {
        const  { channel, recipients, content } = messageData;

        if (!channel) {
            throw new Error("Channel is required");
        }

        // Implement a validation scheme for both SMS and Email
    }

    async getMessageHistory() {
        // Pass the UserID and Options
    }


}