const patientModel = require("../models/patientModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const medicalHistoryModel = require("../models/medicalHistoryModel");
const labResultModel = require("../models/labResultModel");
const treatmentModel = require("../models/treatmentModel");
const vitalSignModel = require("../models/vitalSignModel");
const { Op } = require("sequelize");

const addPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    contactNumber,
    address,
    patient_insurance_provider,
    patient_insurance_id,
    status,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const newPatient = await patientModel.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      patient_insurance_provider,
      patient_insurance_id,
      status,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      status: "success",
      message: "Patient added successfully",
      newPatient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllPatients = async (req, res) => {
  const { status } = req.query;
  const includeModels = [
    { model: medicalHistoryModel },
    { model: labResultModel },
    { model: treatmentModel },
    { model: vitalSignModel },
  ];

  let whereCondition;

  if (status === "Archived") {
    whereCondition = {
      [Op.or]: [{ status: "Discharged" }, { status: "Transferred" }],
    };
  } else if (status === "Admitted") {
    whereCondition = {
      [Op.or]: [{ status: "Admitted" }],
    };
  }

  try {
    const patients = await patientModel.findAll({
      where: whereCondition,
      include: includeModels,
    });
    return res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    contactNumber,
    address,
    patient_insurance_provider,
    patient_insurance_id,
    status,
  } = req.body;

  try {
    const patient = await patientModel.findOne({ where: { id } });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const updatedPatient = await patientModel.update(
      {
        firstName,
        lastName,
        dateOfBirth,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        patient_insurance_provider,
        patient_insurance_id,
        status,
      },
      { where: { id } }
    );

    return res.status(200).json({
      status: "success",
      message: "Patient updated successfully",
      updatedPatient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updatePatientStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const patient = await patientModel.findOne({ where: { id } });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const updatedPatient = await patientModel.update(
      {
        status,
      },
      { where: { id } }
    );

    return res.status(200).json({
      status: "success",
      message: "Patient status updated successfully",
      updatedPatient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await patientModel.findOne({ where: { id } });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await patientModel.destroy({ where: { id } });

    return res
      .status(200)
      .json({ status: "success", message: "Patient deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await patientModel.findOne({
      where: { id },
      include: [
        { model: medicalHistoryModel },
        { model: labResultModel },
        { model: treatmentModel },
        { model: vitalSignModel },
      ],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchPatient = async (req, res) => {
  const { searchQuery = "", status } = req.query;
  try {
    // Base where condition for search query
    const whereCondition = {
      [Op.or]: [
        { firstName: { [Op.like]: `${searchQuery}%` } },
        { lastName: { [Op.like]: `${searchQuery}%` } },
      ],
    };

    // Add status filters based on the provided status
    if (status === "Archived") {
      whereCondition[Op.and] = {
        [Op.or]: [{ status: "Discharged" }, { status: "Transferred" }],
      };
    } else if (status === "Admitted") {
      whereCondition[Op.and] = {
        status: "Admitted",
      };
    }

    // Fetch patients based on the constructed condition
    const patients = await patientModel.findAll({ where: whereCondition });

    return res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
  getPatientById,
  searchPatient,
  updatePatientStatus,
};
