const express = require("express");
const router = express.Router();
const speechToTextController = require("../controllers/speechToTextController");
const multer = require("multer");
const path = require("path");

// Setup multer for handling file uploads
const storage = multer.diskStorage({
  destination: "../../uploads",
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.single("file"),
  speechToTextController.uploadVoiceRecord
);

module.exports = router;
