const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const Appointment = require("./appointmentModel");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    middleInitial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING(55),
      allowNull: true,
    },
    availability_start_day: {
      type: DataTypes.STRING(55),
      allowNull: true,
    },
    availability_end_day: {
      type: DataTypes.STRING(55),
      allowNull: true,
    },
    availability_start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    availability_end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(455),
      allowNull: false,
    },
    role: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

User.hasMany(Appointment, {
  foreignKey: "doctorId", // This should match the `doctorId` in the Appointment model
  onDelete: "CASCADE",
});

Appointment.belongsTo(User, {
  foreignKey: "doctorId", // Ensure this matches the `doctorId` column in Appointment
  onDelete: "CASCADE",
});

module.exports = User;
