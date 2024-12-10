const labResultModel = require("../models/labResultModel");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// const multer = require('multer');
const path = require("path");
const fs = require("fs");
const date = require("date-and-time");
const sequelize = require("../config/database");
const patientModel = require("../models/patientModel");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addLabResults = async (req, res) => {
  const { patientId, doctorId, doctorName, testName, description } = req.body;
  const files = req.files;
  let uploadedFileUrls = [];

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const patient = await patientModel.findOne({ where: { id: patientId } });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const filePath = path.join(__dirname, `../../uploads/${file.filename}`);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
          folder: "files",
        });

        uploadedFileUrls.push(result.secure_url);
        fs.unlinkSync(filePath);
      }
    }

    const labResult = await labResultModel.create({
      patientId,
      doctorId,
      doctorName,
      testName,
      description,
      files: uploadedFileUrls || null,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(200).json({
      status: "success",
      message: "Lab results added successfully",
      labResult,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const getLabResultsById = async (req, res) => {
  const { id } = req.params;

  try {
    const labResult = await labResultModel.findOne({ where: { id } });
    if (!labResult) {
      return res.status(404).json({ message: "Lab result not found" });
    }

    return res.status(200).json({ labResult });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateLabResults = async (req, res) => {
  const { id, testName, description } = req.body;
  const files = req.files;
  let uploadedFileUrls = [];

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;
    const labResult = await labResultModel.findOne({ where: { id } });
    if (!labResult) {
      return res.status(404).json({ message: "Lab result not found" });
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const filePath = path.join(__dirname, `../../uploads/${file.filename}`);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
          folder: "files",
        });

        uploadedFileUrls.push(result.secure_url);
        fs.unlinkSync(filePath);
      }
    }

    const updatedLabResult = await labResult.update({
      testName,
      description,
      files: uploadedFileUrls || labResult.files,
      updatedAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res
      .status(200)
      .json({ message: "Lab results updated successfully", updatedLabResult });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteLabResults = async (req, res) => {
  const { id } = req.body;

  try {
    const labResult = await labResultModel.findOne({ where: { id } });
    if (!labResult) {
      return res.status(404).json({ message: "Lab result not found" });
    }

    await labResult.destroy();

    return res
      .status(200)
      .json({ message: "Lab results deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addLabResults,
  updateLabResults,
  deleteLabResults,
  getLabResultsById,
};
