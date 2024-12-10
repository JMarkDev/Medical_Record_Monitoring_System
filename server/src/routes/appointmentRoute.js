const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/add-appointment", appointmentController.addAppointment);
router.get(
  "/get-appointment/:doctorId",
  appointmentController.getAppointmentByDoctorId
);
router.put(
  "/update-appointment-status/:id",
  appointmentController.updateAppointmentStatus
);
router.delete(
  "/delete-appointment/:id",
  appointmentController.deleteAppointment
);
router.get("/search-appointment", appointmentController.searchAppointment);
router.get("/get-all", appointmentController.getAllAppointments);

module.exports = router;
