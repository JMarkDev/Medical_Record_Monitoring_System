const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");

router.post("/add", medicationController.addMedication);
router.get("/get-medication/:id", medicationController.getMedicationById);
router.put("/update/:id", medicationController.updateMedication);
router.delete("/delete/:id", medicationController.deleteMedication);
router.post("/record-medication", medicationController.recordMedication);
router.get("/get-all", medicationController.getAllMedications);
router.put("/update-status/:id", medicationController.updateMedicationStatus);
router.get("/search/:search", medicationController.searchMedication);

module.exports = router;
