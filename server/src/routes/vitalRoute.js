const express = require("express");
const router = express.Router();
const vitalsController = require("../controllers/vitalsController");
const {
  addVitalsValidationRules,
  validateForm,
} = require("../middlewares/formValidation");

router.post(
  "/add-vitals",
  addVitalsValidationRules(),
  validateForm,
  vitalsController.addVitals
);
router.get("/get-vitals/:id", vitalsController.getVitalsById);
router.put("/update-vitals", vitalsController.updateVitals);
router.delete("/delete-vitals/:id", vitalsController.deleteVitals);

module.exports = router;
