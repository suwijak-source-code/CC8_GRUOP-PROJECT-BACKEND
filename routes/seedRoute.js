const express = require("express");
const router = express.Router();
const checkController = require("../controllers/checkController");
const seedController = require("../controllers/seedController");

router.get("/", seedController.getAllSeed);
router.get("/:id", seedController.getSeedById);
router.post("/", seedController.createSeed);
router.post("/:id", seedController.editSeed);
router.delete("/:id", seedController.deleteSeed);

module.exports = router;
