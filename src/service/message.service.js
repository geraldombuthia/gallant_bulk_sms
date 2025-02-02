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
                        rest.senderId : process.env.BULK_SMS_SENDER_ID, // Implement check for shortcode
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
            // console.log("Model for this channel:", 
            //     await this.storageModels[channel].create(recordData));
            messageRecord = await this.storageModels[channel].create(recordData);
            // console.log("MESSAGE RECORD CREATED:", messageRecord ?
            //     messageRecord.toJSON() : "No record returned");
            // console.log("Message record feedback", messageRecord.dataValues);
            let billSend;
            let usedCredit = 1; //@TODO: Implement access to credit for one sms
            const billingProvider = this.billing.getProvider(channel);
            const currentBalance = billingProvider.checkBalance(userId);
            if (currentBalance < usedCredit) {
                throw new Error("Insufficient credits");
                messageRecord.update({
                    deliveryStatus: "failed",
                    providerResponse: JSON.stringify({
                        message: "Insufficient credits"
                })});
            }
            const providerResponse = await provider.sendMessage(recordData);

            // console.log("This is the provider Response", providerResponse);

            if (providerResponse.status === "success") {
                // const billingProvider = this.billing.getProvider(channel);
                if (channel === "email") {
                    const totalEmails = providerResponse.accepted.length 
                    + providerResponse.rejected.length;
                    usedCredit = totalEmails;
                    console.log(`${totalEmails} have been sent and 
                        the used credits are ${usedCredit}`);
                }
                billSend = await billingProvider.spentCredit(usedCredit, userId);
            }
            // eslint-disable-next-line
            const {ehlo, status, ...responseDetails} = providerResponse;
            // Update message record with provider response
            await messageRecord.update({
                deliveryStatus: providerResponse.status,
                providerId: providerResponse?.messageId,
                providerResponse: JSON.stringify(responseDetails),
                cost: providerResponse.credits_used,
                ...(channel === "email" && {
                    sentAt: new Date(),
                    trackingID: providerResponse.trackingID
                })
            });

            // return {
            //     message: `${channel.toUpperCase()} sent successfully`,
            //     providerResponse,
            //     credits_used: usedCredit,
            //     creditBalance: billSend.creditBalance,
            //     network: providerResponse?.network, // return relevant information
            //     userId
            // };
            
            return providerResponse;
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

            return {
                status: "failed",
                statusCode: 500,
                message: error.message,
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
            channel = "sms",
            limit = 50,
            offset = 0,
            status
        } = options;

        try {
            // use the appropriate model based on channel
            const Model = this.storageModels[channel];

            if (!Model) {
                throw new Error(`Invalid channel: ${channel}`);
            }
            const query = { userId };

            if (status) {
                query.deliveryStatus = status;
            }

            const result =  Model.findAndCountAll({
                where: query,
                limit, 
                offset,
                order: [["createdAt", "DESC"]]
            });

            if (!result || result.count === 0) {
                return { total: 0, data: [], message: "No messages found." };
            }
    
            return {
                total: result.count,
                data: result.rows,
            };
        } catch (error) {
            console.error("Error in getMessageHistory", {
                userId, 
                channel,
                error: error.message,
                stack: error.stack
            });
            throw new Error("Error fetching Message History ");
        }

    }

}

module.exports = MessageService;