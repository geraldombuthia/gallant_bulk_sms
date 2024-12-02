require("dotenv").config()

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
        let messageRecord;
        try {
            // Check whether message is a bulk or single message
            const { 
                channel, 
                userId, 
                phoneNumber, 
                message, 
                subject, 
                recipient, 
                sender,
                textBody,
                htmlBody,
                isHTML = true,
                ...rest
            } = msgPayload;

            console.log("Received message payload",msgPayload)
            // provide some validation

            const provider = this.provider.getCommsProvider(channel);

            if (!provider) {
                throw new Error ("Message provider ${channel} not supported");
            }

            // Prepare  message record based on channel
            const recordData = channel === 'sms' ? {
                userId,
                phoneNumber,
                message,
                senderId: rest.senderId || process.env.SENDER_ID,
                deliveryStatus: 'pending'
            } : {
                userId,
                subject,
                recipient: JSON.stringify(recipient || {}),
                sender,
                textBody,
                htmlBody,
                isHTML,
                deliveryStatus: 'pending'
            };

            messageRecord = await this.storageModels[channel].create(recordData);

            const providerResponse = await provider.sendMessage(
                msgPayload,
                // Storage callback 
                async (payload)=> {
                    await messageRecord.update({
                        deliveryStatus: 'processing'
                    });
                    return payload;
                }, 
                // Billing callback
                async (userId, credits) => {
                    const billingProvider = this.billing.getProvider(channel);
                    return billingProvider.spentCredit(userId, credits);
                    //understand how this will return the spentCredit value
                });
            
            // Update message record with provider response
            await messageRecord.update({
                deliveryStatus: providerResponse.status || 'completed',
                providerId: providerResponse.messageId,
                providerResponse: JSON.stringify(providerResponse),
                cost: providerResponse.cost,
                ...(channel === 'email' && {
                    sentAt: new Date(),
                    trackingID: providerResponse.trackingID
                })
            });
            

            return {
                message: `${channel.toUpperCase()} sent successfully`,
                messageId: messageRecord.id,
                providerResponse // return relevant information
            };

        } catch (error) {

            if (messageRecord) {
                await messageRecord.update({
                    deliveryStatus: 'failed',
                    providerResponse: JSON.stringify({
                        message: error.message,
                        stack: error.stack
                    })
                });
            }

            throw new Error(`Message send failed with ${channel} failed`, error.message);
        }
    }
    async sendBatchMessage(msgPayload) {
        const { channel, messages } = msgPayload;

        // validate

        //process messages in parallel
        const results = await Promise.allSettled(
            messages.map(message => 
                this.sendMessage({
                    channel,
                    ...message
                })
            )
        );

        // Aggregate and return results
        return {
            total: results.length,
            successful: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'failed').length,
            details: results
        };
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

    async getMessageHistory(userId, options = {}) {
        // Pass the UserID and Options
        const {
            channel,
            limit = 50,
            offset = 0,
            status
        } = options;

        // use the appropriate model based on channel
        const Model = this.storageModels[channel] || SMS;

        const query = { userId };

        if (status) query.deliveryStatus = status;

        return Model.findAndCountAll({
            where: query,
            limit, 
            offset,
            order: [['createdAt', 'DESC']]
        });
    }

}

module.exports = MessageService;