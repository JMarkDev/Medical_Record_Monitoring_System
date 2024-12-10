const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const {
  patientValidationRules,
  validateForm,
} = require("../middlewares/formValidation");

router.get("/get-all-patients", patientController.getAllPatients);
router.post(
  "/add-patient",
  patientValidationRules(),
  validateForm,
  patientController.addPatient
);
router.put("/update-patient/:id", patientController.updatePatient);
router.delete("/delete-patient/:id", patientController.deletePatient);
router.get("/get-patient-by-id/:id", patientController.getPatientById);
router.get("/search-patient", patientController.searchPatient);
router.put("/update-patient-status/:id", patientController.updatePatientStatus);
router.get("/filter-patient", patientController.filterPatient);

module.exports = router;
