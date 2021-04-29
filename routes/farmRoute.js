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
router.post("/", farmController.createFarm);
router.post("/:id", farmController.editFarm);
router.delete("/:id", farmController.deleteFarm);

module.exports = router;
