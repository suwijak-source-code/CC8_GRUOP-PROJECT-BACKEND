const express = require("express");
const checkController = require("../controllers/checkController");
const jobController = require("../controllers/jobController");
const plantingController = require("../controllers/plantingController");
const farmController = require("../controllers/farmController");

const router = express.Router();

router.get('/by-user/:status', checkController.protect, checkController.checkGardenerRole, jobController.getJobByUser);

router.get('/assign-job/:status', checkController.protect, checkController.checkAdminRole, jobController.getJobAssign);

router.get('/', checkController.protect, checkController.checkAdminRole, jobController.getJob);

router.post('/', checkController.protect, checkController.checkAdminRole, plantingController.updateAssignStatus,
    jobController.createJob);

router.patch('/edit-assign/:id', checkController.protect, checkController.checkAdminRole, jobController.editAssignJob);

router.patch('/cancel/:id', checkController.protect, checkController.checkAdminRole, jobController.cancelJob,
    plantingController.updateDate);

router.patch('/:id', checkController.protect, checkController.checkAdminRoGardenerRole, jobController.updateStatus,
    plantingController.updateStatus, plantingController.updateHarvestedAmount, farmController.updateStatus);

module.exports = router;