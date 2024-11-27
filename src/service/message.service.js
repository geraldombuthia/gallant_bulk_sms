const MessageProviderFactory = require("../providers/comms/comms.factory");

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
            const provider = this.provider.getCommsProvider(msgPayload.provider);

            if (!provider) {
                throw new Error ("Message provider ${providerName} not supported");
            }
            const sendMessage = await provider.sendMessage(msgPayload);
            // Message store will happen in the provider layer
            console.log(sendMessage);

            return sendMessage;
        } catch (error) {

            console.error("Message sending failed")
            throw new Error("Message send failed with $providerName failed");
        }
    }
}