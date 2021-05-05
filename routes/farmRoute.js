const express = require("express");
const router = express.Router();
const checkController = require("../controllers/checkController");
const farmController = require("../controllers/farmController");

router.get(
  "/",
  // checkController.protect,
  farmController.getAllFarms
);
router.get("/:id", farmController.getFarmById);
router.post(
  "/",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.createFarm
);
router.post(
  "/:id",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.editFarm
);
router.delete(
  "/:id",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.deleteFarm
);

module.exports = router;
