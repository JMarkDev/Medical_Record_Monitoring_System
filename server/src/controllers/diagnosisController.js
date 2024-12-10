const date = require("date-and-time");
const sequelize = require("../config/database");
const diagnosisModel = require("../models/diagnosisModel");

const addDiagnosis = async (req, res) => {
  const {
    patientId,
    diagnosisName,
    doctorName,
    details,
    diagnosisDate,
    notes,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const newDiagnosis = await diagnosisModel.create({
      patientId,
      diagnosisName,
      doctorName,
      details,
      diagnosisDate,
      notes,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      status: "success",
      message: "Diagnosis added successfully",
      newDiagnosis,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getDiagnosisById = async (req, res) => {
  const { diagnosisId } = req.params;

  try {
    const diagnosis = await diagnosisModel.findByPk(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateDiagnosis = async (req, res) => {
  const { diagnosisId } = req.params;
  const {
    patientId,
    diagnosisName,
    doctorName,
    details,
    diagnosisDate,
    notes,
  } = req.body;

  try {
    const diagnosis = await diagnosisModel.findByPk(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    const updatedAt = new Date();
    const formattedDate = date.format(updatedAt, "YYYY-MM-DD HH:mm:ss", true);

    await diagnosis.update({
      patientId,
      diagnosisName,
      doctorName,
      details,
      diagnosisDate,
      notes,
      updatedAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(200).json({
      status: "success",
      message: "Diagnosis updated successfully",
      diagnosis,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteDiagnosis = async (req, res) => {
  const { diagnosisId } = req.params;

  try {
    const diagnosis = await diagnosisModel.findByPk(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    await diagnosis.destroy();

    return res.status(200).json({
      status: "success",
      message: "Diagnosis deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDiagnosis,
  getDiagnosisById,
  updateDiagnosis,
  deleteDiagnosis,
};
