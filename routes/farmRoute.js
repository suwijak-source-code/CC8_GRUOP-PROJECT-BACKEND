const express = require("express");
const checkController = require("../controllers/checkController");
const farmController = require("../controllers/farmController");

const router = express.Router();

router.get(
  "/search",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.searchFarm
);

router.get(
  "/",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.getAllFarm
);

router.get(
  "/:status",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.getFarm
);

router.post(
  "/",
  checkController.protect,
  checkController.checkAdminRole,
  farmController.createFarm
);

router.put(
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
