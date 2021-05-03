const express = require("express");
const customerControler = require("../controllers/customerControler");

const router = express.Router();

router.put("/", customerControler.addCustomer);
router.get("/", customerControler.getCustomer);
router.put("/", customerControler.updateCustomer);
router.delete("/", customerControler.deleteCustomer);

module.exports = router;
