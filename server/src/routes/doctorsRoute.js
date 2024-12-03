const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

router.get("/get-all-doctors", doctorController.getAllDoctors);
router.get("/get-approved-doctors", doctorController.getApprovedDoctors);

module.exports = router;
