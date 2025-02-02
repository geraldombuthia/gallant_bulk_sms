const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/message.controller");
const APIController = require("../controllers/api.controller");

router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

// @TODO: Introduce a middleware to validate the user's api key
router.get("/sendSMS", (req, res)=> {
    res.status(200).json({message: "send sms using this endpoint", 
        object_format: {message: "message", phoneNumber: "phoneNumber"}
    });

});
router.post("/sendSMS", APIController.sendSMS);
router.post("/sendEmail", MessageController.sendEmail);
router.post("/sendBulksms", MessageController.sendBulkMSG);

module.exports = router;