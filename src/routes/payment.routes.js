const express = require("express");
const PaymentController = require("../controllers/payment.controller");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to gallant bulk pay"});
});

router.post("/mpesa", PaymentController.createPayment);
router.post("/callback", PaymentController.handleCallback);

module.exports = router;