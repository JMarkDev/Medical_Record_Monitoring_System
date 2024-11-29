const appintmentModel = require("../models/appointmentModel");
const date = require("date-and-time");
const sequelize = require("../config/database");

const addAppointment = async (req, res) => {
  const { user_id, doctor_id, date, time } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const newAppointment = await appintmentModel.create({
      user_id,
      doctor_id,
      date,
      time,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json(newAppointment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addAppointment,
};
