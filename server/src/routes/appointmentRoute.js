const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/add-appointment", appointmentController.addAppointment);

module.exports = router;
