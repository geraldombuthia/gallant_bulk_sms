const express = require("express");
const router = express.Router();

const MessageController = require("../controllers/message.controller");

router.get("/", (req, res) => {
    res.status(200).json({message: "Send single SMS through this"});
});

router.post("/sms", MessageController.sendMessage);
router.post("/email", MessageController.sendEmail);
router.post("/bulksms", MessageController.sendMessage);

module.exports = router;
