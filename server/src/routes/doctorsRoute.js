const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorsController");

router.get("/get-all-doctors", doctorController.getAllDoctors);
router.get("/get-approved-doctors", doctorController.getApprovedDoctors);

module.exports = router;
