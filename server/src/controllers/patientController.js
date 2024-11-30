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
  } = req.body;
  console.log(req.body);

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
  try {
    const patients = await patientModel.findAll({
      include: [
        { model: medicalHistoryModel },
        { model: labResultModel },
        { model: treatmentModel },
        { model: vitalSignModel },
      ],
    });
    return res.status(200).json(patients);
  } catch (error) {
    console.log(error);
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

    return res.status(200).json({ status: "success", patient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchPatient = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const patients = await patientModel.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `${searchQuery}%` } },
          { lastName: { [Op.like]: `${searchQuery}%` } },
        ],
      },
    });

    return res.status(200).json(patients);
  } catch (error) {
    console.log(error);
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
};
