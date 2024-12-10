const Prescription = require("../models/prescriptionModel");
const Medication = require("../models/medicationModel");
const date = require("date-and-time");
const sequilize = require("../config/database");
const { Op } = require("sequelize");
const { addNotification } = require("./notificationController");

const addPrescription = async (req, res) => {
  const {
    patientId,
    doctorId,
    doctorName,
    patientName,
    diagnosis,
    instructions,
    medicines,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    // Validate mandatory fields
    if (!patientId || !doctorId || !doctorName || !diagnosis) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: patientId, doctorId, doctorName, or diagnosis.",
      });
    }

    const newPrescription = await Prescription.create({
      patientId,
      patientName,
      doctorId,
      doctorName,
      diagnosis,
      medicine: medicines,
      instructions,
      createdAt: sequilize.literal(`'${formattedDate}'`),
    });

    const content = `New medication added for ${patientName}`;
    await addNotification({ content: content }); // Pass nurse ID here

    return res.status(201).json({
      status: "success",
      message: "Prescription added successfully.",
      newPrescription,
    });
  } catch (err) {
    console.error("Error adding prescription:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while adding the prescription.",
      error: err.message,
    });
  }
};

// const getAllPrescriptions = async (req, res) => {
//   try {
//     const prescriptions = await Prescription.findAll({
//       include: Medication,
//     });

//     return res.json({
//       status: "success",
//       data: prescriptions,
//     });
//   } catch (err) {
//     console.error("Error getting prescriptions:", err);
//     return res.status(500).json({
//       status: "error",
//       message: "An error occurred while getting the prescriptions.",
//       error: err.message,
//     });
//   }
// };

const getPrescriptionsByStatus = async (req, res) => {
  const { status } = req.params;
  console.log("Status:", status);

  try {
    let prescriptions;

    if (status === "all") {
      prescriptions = await Prescription.findAll();
    } else {
      prescriptions = await Prescription.findAll({
        where: { status },
      });
    }

    return res.json({
      status: "success",
      data: prescriptions,
    });
  } catch (err) {
    console.error("Error getting prescriptions by status:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while getting the prescriptions.",
      error: err.message,
    });
  }
};

const getPrescriptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const prescription = await Prescription.findByPk(id, {
      include: Medication,
    });

    if (!prescription) {
      return res.status(404).json({
        status: "error",
        message: "Prescription not found.",
      });
    }

    return res.json({
      status: "success",
      data: prescription,
    });
  } catch (err) {
    console.error("Error getting prescription:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while getting the prescription.",
      error: err.message,
    });
  }
};

const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { diagnosis, instructions, status } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({
        status: "error",
        message: "Prescription not found.",
      });
    }

    prescription.diagnosis = diagnosis || prescription.diagnosis;
    prescription.instructions = instructions || prescription.instructions;
    prescription.status = status || prescription.status;
    prescription.updatedAt = sequilize.literal(`'${formattedDate}'`);

    await prescription.save();

    return res.json({
      status: "success",
      message: "Prescription updated successfully.",
      data: prescription,
    });
  } catch (err) {
    console.error("Error updating prescription:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the prescription.",
      error: err.message,
    });
  }
};

const deletePrescription = async (req, res) => {
  const { id } = req.params;

  try {
    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({
        status: "error",
        message: "Prescription not found.",
      });
    }

    await prescription.destroy();

    return res.json({
      status: "success",
      message: "Prescription deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting prescription:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the prescription.",
      error: err.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({
        status: "error",
        message: "Prescription not found.",
      });
    }

    prescription.status = status || prescription.status;

    await prescription.save();

    return res.json({
      status: "success",
      message: "Prescription status updated successfully.",
      data: prescription,
    });
  } catch (err) {
    console.error("Error updating prescription status:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the prescription status.",
      error: err.message,
    });
  }
};

const searchPrescription = async (req, res) => {
  const { search } = req.params;

  try {
    const prescriptions = await Prescription.findAll({
      where: {
        [Op.or]: [
          { patientName: { [Op.like]: `${search}%` } },
          { diagnosis: { [Op.like]: `${search}%` } },
          { doctorName: { [Op.like]: `${search}%` } },
        ],
      },
    });

    return res.json({
      status: "success",
      data: prescriptions,
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
  addPrescription,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  // getAllPrescriptions,
  updateStatus,
  searchPrescription,
  getPrescriptionsByStatus,
};
