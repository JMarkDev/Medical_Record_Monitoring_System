const rolesList = require("../constants/rolesList");
const userModel = require("../models/userModel");
const statusList = require("../constants/statusList");
const { Op } = require("sequelize");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await userModel.findAll({
      where: {
        role: rolesList.doctor,
        [Op.or]: [
          { status: statusList.verified },
          { status: statusList.approved },
        ],
      },
    });

    return res.status(200).json(doctors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await userModel.findAll({
      where: {
        role: rolesList.doctor,
        status: statusList.approved,
      },
    });

    return res.status(200).json(doctors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllDoctors,
  getApprovedDoctors,
};
