const medicationModel = require("../models/medicationModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const { addNotification } = require("./notificationController");
const userModel = require("../models/userModel");

const addMedication = async (req, res) => {
  const {
    patientId,
    patientName,
    doctorName,
    medicationName,
    description,
    dosage,
    frequency,
    startDate,
    endDate,
    status,
    notes,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    // Validate mandatory fields
    if (!patientId || !medicationName || !dosage || !frequency || !startDate) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: patientId, medicationName, dosage, frequency, or startDate.",
      });
    }

    // Create the new medication record
    const newMedication = await medicationModel.create({
      patientId,
      patientName: patientName || null, // Optional
      doctorName: doctorName || null, // Optional
      medicationName,
      description: description || null, // Optional
      dosage,
      frequency,
      startDate,
      endDate: endDate || null, // Optional
      status: status || "pending", // Default to "Pending"
      notes: notes || null, // Optional
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    const content = `New medication added for ${patientName}`;

    await addNotification({ content: content, user: "doctor" }); // Pass nurse ID here

    return res.status(201).json({
      status: "success",
      message: "Medication added successfully.",
      data: newMedication,
    });
  } catch (err) {
    console.error("Error adding medication:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while adding the medication.",
      error: err.message,
    });
  }
};

const getMedicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const medication = await medicationModel.findOne({ where: { id } });
    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    return res.status(200).json({ medication });
  } catch (err) {
    console.error("Error getting medication by ID:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the medication.",
      error: err.message,
    });
  }
};

const updateMedication = async (req, res) => {
  const {
    id,
    medicationName,
    dosage,
    frequency,
    startDate,
    endDate,
    status,
    notes,
  } = req.body;

  try {
    const medication = await medicationModel.findOne({ where: { id } });
    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    const updatedMedication = await medication.update({
      medicationName: medicationName || medication.medicationName,
      dosage: dosage || medication.dosage,
      frequency: frequency || medication.frequency,
      startDate: startDate || medication.startDate,
      endDate: endDate || medication.endDate,
      status: status || medication.status,
      notes: notes || medication.notes,
    });

    return res.status(200).json({
      status: "success",
      message: "Medication updated successfully.",
      data: updatedMedication,
    });
  } catch (err) {
    console.error("Error updating medication:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the medication.",
      error: err.message,
    });
  }
};

const deleteMedication = async (req, res) => {
  const { id } = req.params;

  try {
    const medication = await medicationModel.findOne({ where: { id } });
    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    await medication.destroy();

    return res.status(200).json({
      status: "success",
      message: "Medication deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting medication:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the medication.",
      error: err.message,
    });
  }
};

const recordMedication = async (req, res) => {
  const {
    patientId,
    patientName,
    transcription,
    medicationDate,
    doctorName,
    status,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    // Validate mandatory fields
    if (!patientId || !medicationDate) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: patientId, medicationName, medicationDate.",
      });
    }

    // Create the new medication record
    const newMedication = await medicationModel.create({
      patientId,
      patientName: patientName,
      doctorName: doctorName,
      transcription: transcription || null, // Optional
      medicationDate,
      status: status || "Pending", // Default to "Pending"
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    const content = `New medication added for ${patientName}`;
    await addNotification({ content: content, user: "doctor" }); // Pass nurse ID here

    return res.status(201).json({
      status: "success",
      message: "Medication recorded successfully.",
      data: newMedication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while recording the medication.",
      error: error.message,
    });
  }
};

const getAllMedications = async (req, res) => {
  try {
    const medications = await medicationModel.findAll();
    return res.status(200).json(medications);
  } catch (err) {
    console.error("Error getting all medications:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving all medications.",
      error: err.message,
    });
  }
};

const updateMedicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const medication = await medicationModel.findOne({ where: { id } });
    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    const updatedMedication = await medication.update({
      status: status || medication.status,
    });

    const content = `Medication ${status} for ${medication.patientName}`;
    await addNotification({ content: content, user: "nurse" }); // Pass nurse ID here

    return res.status(200).json({
      status: "success",
      message: "Medication status updated successfully.",
      data: updatedMedication,
    });
  } catch (err) {
    console.error("Error updating medication status:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the medication status.",
      error: err.message,
    });
  }
};

const searchMedication = async (req, res) => {
  const { search } = req.params;

  try {
    const medication = await medicationModel.findAll({
      where: {
        [Op.or]: [
          { patientName: { [Op.like]: `${search}%` } },
          { doctorName: { [Op.like]: `${search}%` } },
        ],
      },
    });

    return res.json({
      status: "success",
      data: medication,
    });
  } catch (err) {
    console.error("Error searching prescriptions:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while searching the prescriptions.",
      error: err.message,
    });
  }
};
module.exports = {
  addMedication,
  getMedicationById,
  updateMedication,
  deleteMedication,
  recordMedication,
  getAllMedications,
  updateMedicationStatus,
  searchMedication,
};
