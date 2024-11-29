const appointmentModel = require("../models/appointmentModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const { sendNotification } = require("../utils/successBookAppointment");

const addAppointment = async (req, res) => {
  const {
    doctorId,
    doctorName,
    fullName: patientName,
    contact_number,
    email,
    purpose,
    appointmentDate,
    time: appointmentTime,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const newAppointment = await appointmentModel.create({
      doctorId,
      fullName: patientName,
      contact_number,
      email,
      purpose,
      date: appointmentDate,
      time: appointmentTime,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    const appointmentDetails = {
      patientName,
      date: appointmentDate,
      time: appointmentTime,
      doctorName,
    };

    await sendNotification({
      email,
      subject: "Medical Record Monitoring System - Appointment Confirmation",
      appointmentDetails,
    });

    return res.status(201).json({
      status: "success",
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const getAppointmentByDoctorId = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await appointmentModel.findAll({
      where: {
        doctorId: doctorId,
      },
    });

    return res.status(200).json(appointments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await appointmentModel.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const updatedAppointment = await appointmentModel.update(
      {
        status,
      },
      {
        where: {
          id: id,
        },
      }
    );

    await appointment.update({ status });

    return res.status(200).json({
      message: "Appointment status updated successfully",
      updatedAppointment,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await appointmentModel.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.destroy();

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addAppointment,
  getAppointmentByDoctorId,
  updateAppointmentStatus,
  deleteAppointment,
};
