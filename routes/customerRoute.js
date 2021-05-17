const express = require("express");
const router = express.Router();
const productController = require("../controllers/customerController");

router.get("/", productController.getAllCustomers);

module.exports = router;
