const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);
router.post("/address", customerController.createNewAddress);
router.put("/", customerController.editCustomer);

module.exports = router;
