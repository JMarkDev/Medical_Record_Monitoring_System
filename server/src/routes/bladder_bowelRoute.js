const express = require("express");
const router = express.Router();
const bladder_bowel_diaryController = require("../controllers/bladder_bowelController");

router.post("/add", bladder_bowel_diaryController.addBladderBowelDiary);
router.put(
  "/update/:id",
  bladder_bowel_diaryController.updateBladderBowelDiary
);
router.get("/id/:id", bladder_bowel_diaryController.getBladderBowelDiaryById);
router.delete(
  "/delete/:id",
  bladder_bowel_diaryController.deleteBladderBowelDiary
);

module.exports = router;
