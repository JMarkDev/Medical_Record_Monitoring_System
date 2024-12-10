const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const labResultController = require("../controllers/labResultsController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads");
    console.log("Upload path:", uploadPath); // Log the upload path
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// allow only specific file types (CSV, PDF, PPT, DOC and images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "image/jpeg", // JPEG images
    "image/png", // PNG images
    "image/gif", // GIF images
    "image/webp", // WebP images
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file type");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
  "/add-lab-results",
  upload.array("files"),
  labResultController.addLabResults
);
router.put("/update-lab-results/:id", labResultController.updateLabResults);
router.delete("/delete-lab-results", labResultController.deleteLabResults);
router.get("/get-lab-results/:id", labResultController.getLabResultsById);

module.exports = router;
