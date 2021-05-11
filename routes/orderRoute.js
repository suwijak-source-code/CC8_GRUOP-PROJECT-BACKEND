const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderContoller");
const OrderItemController = require("../controllers/orderItemController");

router.get("/", orderController.getAll);
router.get("/:id", orderController.getOrderById);
router.post(
  "/",
  orderController.createOrder,
  OrderItemController.createOrderItem
);
router.post("/:id", orderController.editOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
