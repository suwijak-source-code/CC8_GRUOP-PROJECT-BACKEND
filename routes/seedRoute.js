const express = require("express");
const router = express.Router();
const checkController = require("../controllers/checkController");
const seedController = require("../controllers/seedController");

router.get("/", seedController.getAllSeed);
router.get("/:id", seedController.getSeedById);
router.post(
  "/",
  checkController.protect,
  checkController.checkAdminRole,
  seedController.createSeed
);
router.post(
  "/:id",
  checkController.protect,
  checkController.checkAdminRole,
  seedController.editSeed
);
router.delete(
  "/:id",
  checkController.protect,
  checkController.checkAdminRole,
  seedController.deleteSeed
);

module.exports = router;
