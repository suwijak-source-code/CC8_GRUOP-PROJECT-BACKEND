const express = require("express");
const checkController = require("../controllers/checkController");
const plantingController = require("../controllers/plantingController");
const farmController = require("../controllers/farmController");


const router = express.Router();

router.get('/search', checkController.protect, checkController.checkAdminRole, plantingController.searchPlanting);

router.get('/work-plan/:status', checkController.protect, checkController.checkAdminRole, plantingController.getWorkPlanting);

router.get('/:status', checkController.protect, checkController.checkAdminRole, plantingController.getPlanting);

router.post('/', checkController.protect, checkController.checkAdminRole, plantingController.createPlanting,
    farmController.updateStatus);

router.put('/:id', checkController.protect, checkController.checkAdminRole, plantingController.editPlanting,
    farmController.updateStatus);

router.patch('/cancel/:id', checkController.protect, checkController.checkAdminRole, plantingController.updateStatus,
    farmController.updateStatus);

router.patch('/cancel-job/:id', checkController.protect, checkController.checkAdminRole, plantingController.updateDate);

router.patch('/update-harvest-amount/:id', checkController.protect, checkController.checkAdminRole, plantingController.updateHarvestedAmount);

module.exports = router;
