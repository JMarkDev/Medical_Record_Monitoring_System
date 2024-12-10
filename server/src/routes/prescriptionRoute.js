const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");

router.post("/add", prescriptionController.addPrescription);
router.get("/get-prescription/:id", prescriptionController.getPrescriptionById);
router.put("/update/:id", prescriptionController.updatePrescription);
router.delete("/delete/:id", prescriptionController.deletePrescription);
router.put("/update-status/:id", prescriptionController.updateStatus);
// router.get("/get-all", prescriptionController.getAllPrescriptions);
router.get("/search/:search", prescriptionController.searchPrescription);
router.get(
  "/get-by-status/:status",
  prescriptionController.getPrescriptionsByStatus
);

module.exports = router;
