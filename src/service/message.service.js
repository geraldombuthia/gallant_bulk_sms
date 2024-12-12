require("dotenv").config();

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
        };
        this.billing = new CreditHandlerFactory();
    }
    usedCredit = 1; // To be better initialized

    async sendMessage(msgPayload) {
        let messageRecord;
        try {
            if (!msgPayload.channel) {
                throw new Error("Channel is required");
            }
            
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
                isHTML,
                ...rest
            } = msgPayload;

            // console.log("Received message payload",msgPayload);
            // provide some validation

            const provider = this.provider.getCommsProvider(channel);
            console.log("The provider is ", provider);
            if (!provider) {
                throw new Error (`Message provider ${channel} not supported`);
            }
            
            let recordData;
            switch (channel.toLowerCase()) {
            case "sms":
                recordData = {
                    userId,
                    phoneNumber,
                    message,
                    senderId: (rest && rest.senderId) ? 
                        rest.senderId : process.env.SENDER_ID, // Implement check for shortcode
                    deliveryStatus: "pending"
                };
                break;
            case "email":
                recordData = {
                    userId,
                    subject,
                    recipient: JSON.stringify({
                        to: [recipient], // Ensure it's in the right format
                        cc: [],
                        bcc: []
                    }),
                    sender,
                    textBody,
                    htmlBody,
                    isHTML: isHTML ?? true,
                    deliveryStatus: "pending"
                };
                break;
            default:
                throw new Error(`Unsupported channel: ${channel}`);
            }
            console.log("Record data is", recordData);
            console.log("Storage Models:", Object.keys(this.storageModels));
            console.log("Trying to create record for channel:", channel);
            // console.log("Model for this channel:", 
            //     await this.storageModels[channel].create(recordData));
            // messageRecord = await this.storageModels[channel].create(recordData);
            // console.log("MESSAGE RECORD CREATED:", messageRecord ?
            //     messageRecord.toJSON() : "No record returned");
            // console.log("Message record feedback", messageRecord.dataValues);
            const providerResponse = await provider.sendMessage(recordData);
            console.log("This is the feedback from provider send", await provider.sendMessage(messageRecord));
            console.log("The provider Response is ",providerResponse);

            let billSend;
            const usedCredit = 1;

            if (providerResponse.status === "success") {
                console.log("Provider response returned success");
                const billingProvider = this.billing.getProvider(channel);
                billSend = await billingProvider.spentCredit(usedCredit, userId);
                console.log("Billing Send response ", billSend);
            }
            // Update message record with provider response
            await messageRecord.update({
                deliveryStatus: providerResponse.status === "success" ? "success" : "failed",
                providerId: providerResponse.messageId,
                providerResponse: JSON.stringify(providerResponse),
                cost: providerResponse.credits_used,
                ...(channel === "email" && {
                    sentAt: new Date(),
                    trackingID: providerResponse.trackingID
                })
            });

            return {
                message: `${channel.toUpperCase()} sent successfully`,
                messageId: messageRecord.id,
                recipient: providerResponse.recipient,
                credits_used: userId,
                creditBalance: billSend.creditBalance,
                network: providerResponse.network // return relevant information

            };

        } catch (error) {

            if (messageRecord) {
                await messageRecord.update({
                    deliveryStatus: "failed",
                    providerResponse: JSON.stringify({
                        message: error.message,
                        stack: error.stack
                    })
                });
                
            }

            // throw new Error(`Message send failed with ${channel} channel: ${error.message}`);
        }
    }
    
    async sendBatchMessage(msgPayload) {
        const { channel, messages } = msgPayload;

        // validate

        // process messages in parallel
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
            successful: results.filter(r => r.status === "fulfilled").length,
            failed: results.filter(r => r.status === "failed").length,
            details: results
        };
    }
    async storeMessages() {

    }

    async billMessageCredits() {
        // Fetch remaining credits
    }

    validateMessage(messageData) {
        const  { channel, recipients } = messageData;

        if (!channel) {
            throw new Error("Channel is required");
        }
        if (channel === "email" && !recipients) {
            throw new Error("Recipients required in Email");
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

        try {
            // use the appropriate model based on channel
            const Model = this.storageModels[channel];

            const query = { userId };

            if (status) {
                query.deliveryStatus = status;
            }

            return Model.findAndCountAll({
                where: query,
                limit, 
                offset,
                order: [["createdAt", "DESC"]]
            });
        } catch (error) {
            throw new Error("Error fetching Message History ", error);
        }

    }

}

module.exports = MessageService;