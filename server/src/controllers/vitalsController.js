const rolesList = require("../constants/rolesList");
const userModel = require("../models/userModel");
const sequelize = require("../config/database");
const statusList = require("../constants/statusList");
const { Op } = require("sequelize");
const vitalsModel = require("../models/vitalModel");
const date = require("date-and-time");

// const getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await userModel.findAll({
//       where: {
//         role: rolesList.doctor,
//         [Op.or]: [
//           { status: statusList.verified },
//           { status: statusList.approved },
//         ],
//       },
//     });

//     return res.status(200).json(doctors);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// const getApprovedDoctors = async (req, res) => {
//   try {
//     const doctors = await userModel.findAll({
//       where: {
//         role: rolesList.doctor,
//         status: statusList.approved,
//       },
//     });

//     return res.status(200).json(doctors);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

const getVitalsById = async (req, res) => {
  const { id } = req.params;

  try {
    const vitals = await vitalsModel.findOne({
      where: {
        id,
      },
    });

    return res.status(200).json(vitals);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addVitals = async (req, res) => {
  const {
    patientId,
    nurseId,
    nurseName,
    bloodPressure,
    bodyTemperature,
    heartRate,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const vitals = await vitalsModel.create({
      patientId,
      nurseId,
      nurseName,
      bloodPressure,
      bodyTemperature,
      heartRate,
      measurementTime: sequelize.literal(`'${formattedDate}'`),
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      status: "success",
      message: "Vitals added successfully",
      vitals,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateVitals = async (req, res) => {
  const { id } = req.params;
  const {
    patientId,
    nurseId,
    nurseName,
    bloodPressure,
    bodyTemperature,
    heartRate,
  } = req.body;

  try {
    const vitals = await vitalsModel.update(
      {
        patientId,
        nurseId,
        nurseName,
        bloodPressure,
        bodyTemperature,
        heartRate,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(201).json({
      status: "success",
      message: "Vitals updated successfully",
      vitals,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const deleteVitals = async (req, res) => {
  const { id } = req.params;

  try {
    await vitalsModel.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Vitals deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addVitals,
  updateVitals,
  deleteVitals,
  getVitalsById,
};
