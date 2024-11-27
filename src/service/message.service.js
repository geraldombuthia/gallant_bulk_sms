const MessageProviderFactory = require("../providers/comms/comms.factory");
const SMSModel = require("../models/smsMsg.model");
const EmailModel = require("../models/emailMsg.models");

/**
 * @brief Handles Message transfer using the available 
 * Message providers
 */
class MessageService {
    constructor () {
        this.provider = new MessageProviderFactory();
    }

    async sendMessage(msgPayload) {
        try {
            const { channel, ...msgPayload } = msgPayload;

            const provider = this.provider.getCommsProvider(channel);

            if (!provider) {
                throw new Error ("Message provider ${providerName} not supported");
            }
            // Consider sending a message with a callback attached to store and bill
            // Or do it here
            const providerResponse = await provider.sendMessage(msgPayload);
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