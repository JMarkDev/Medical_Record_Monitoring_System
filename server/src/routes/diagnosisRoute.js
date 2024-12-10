const express = require("express");
const router = express.Router();
const diagnosisController = require("../controllers/diagnosisController");

router.post("/add", diagnosisController.addDiagnosis);
router.get("/:diagnosisId", diagnosisController.getDiagnosisById);
router.put("/:diagnosisId", diagnosisController.updateDiagnosis);
router.delete("/:diagnosisId", diagnosisController.deleteDiagnosis);

module.exports = router;
