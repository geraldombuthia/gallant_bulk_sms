const express = require("express");
const CreditController = require("../controllers/credits.controller");

const router = express.Router();

router.get("/", CreditController.getBalance);

module.exports = router;