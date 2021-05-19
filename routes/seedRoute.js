const express = require("express");
const checkController = require("../controllers/checkController");
const seedController = require("../controllers/seedController");
const plantingController = require("../controllers/plantingController");



const router = express.Router();

router.get('/search', checkController.protect, checkController.checkAdminRole, seedController.searchSeed);

router.get('/', checkController.protect, checkController.checkAdminRole, seedController.getSeed);

router.post('/', checkController.protect, checkController.checkAdminRole, seedController.createSeed);

router.put('/:id', checkController.protect, checkController.checkAdminRole, seedController.editSeed,
    plantingController.updateDate);

router.delete('/:id', checkController.protect, checkController.checkAdminRole, seedController.deleteSeed);


module.exports = router;