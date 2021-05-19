const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderContoller");
const orderItemController = require("../controllers/orderItemController");
const nodemailerMiddleware = require("../middlewares/nodemailerMiddleware");

router.get("/", orderController.getAll);
router.get("/:id", orderController.getOrderById);
router.post("/email", nodemailerMiddleware.sendInvoice);
router.post(
  "/",
  orderController.createOrder,
  orderItemController.createOrderItem
);
router.put(
  "/:id",
  orderController.editOrder,
  orderItemController.editOrderItem
);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
