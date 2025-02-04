const MessageService = require("../service/message.service");
const formatToIntNumber = require("../utils/formatInternational");

class MessageController {
    constructor() {
        this.MessageService = new MessageService();
        this.sendMessage = this.sendMessage.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.validateEmailInput = this.validateEmailInput.bind(this);
    }
    // validate phone number
    // Create SMS record

    async sendMessage(req, res) {
        try {
            // Extract channel from request route
            const { phoneNumber, message } = req.body;

            // Input validation methods
            this.validateSMSInput(phoneNumber, message);

            const formatNumber = formatToIntNumber(phoneNumber);

            const userId = req.user.id; // implement with API key 

            const result = await this.MessageService.sendMessage({
                phoneNumber: formatNumber, 
                country: "KE",
                message,
                userId,
                channel: "sms"
            });
            
            // Handle remaining credits_used and balance_after somewhere else
            const {providerResponse} = result;

            const filteredProviderResponse = {
                status: providerResponse.status,
                message_id: providerResponse.message_id,
                recipient: providerResponse.recipient,
                network: providerResponse.network,
                timestamp: providerResponse.timestamp
            };
            result.providerResponse = filteredProviderResponse;
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({
                error: "Failed to send SMS",
                message: error.message
            });
        }
    }

    async sendBulkMSG(req, res) {
        // To be implemented

        return res.json(404).json({
            message: "Service not available",
        });
    }

    async sendEmail(req, res) {
        const startTime = Date.now();
        const { 
            subject, 
            recipient, 
            sender, 
            textBody, 
            htmlBody,
            isHTML 
        } = req.body;

        // console.log(req.body);
        try {

            const msgPayload = {
                subject,
                recipient,
                sender,
                textBody,
                htmlBody,
                isHTML,
                channel: "email",
                userId: 1
            };

            // this.validateEmailInput(msgPayload);
            const response = await this.MessageService.sendMessage(msgPayload);

            console.log("This is the message response: ", response);

            const duration = Date.now() - startTime;

            if (!response || response.status !== "success") {
                console.log("Sending Mail failed:", response);
                return res.status(201).json({
                    success: "failed",
                    duration,
                    response
                });
            }
            return res.status(200).json({
                success: true,
                duration,
                response
            });

        } catch (error) {
            console.error("Sending Mail failed:" , error);

            return res.status(500).json({
                message: "Sending mail failed",
            });
        }

    }
    async getSMSHistory(req, res) {
        try {
            const userId = req.user.id;

            const {
                status,
                startDate,
                endDate,
                page = 1,
                limit = 50
            } = req.query;
            
            const result = await this.MessageService.getMessageHistory({
                userId,
                status,
                startDate,
                endDate,
                page,
                limit
            });

            return res.status(200).json(result);

        } catch (error) {
            return res.status(500).json({
                error: "Failed to retrieve SMS history",
                message: error.message
            });
        }   
    }

    validateSMSInput(phone, message) {
        if (!phone) {
            throw new Error("Phone number is required");
        }

        if (!message) {
            throw new Error("Message is required");
        }
        
    }

    validateEmailInput(emailObj) {
        if (!emailObj.subject) {
            throw new Error("Please add a subject");
        }

        if (!emailObj.recipient) {
            throw new Error("You need to have atleast one recipient");
        }

        if (!emailObj.sender) {
            throw new Error("Please add the sender email");
        }

        if (!emailObj.textBody || !emailObj.htmlBody) {
            throw new Error("Please add an email body");
        }

    }

}

module.exports = new MessageController();