const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const VitalSigns = sequelize.define(
  "vital_signs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },
    nurseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Assuming nurses are stored in the Users table
        key: "id",
      },
    },
    bloodPressure: {
      type: DataTypes.STRING(20),
      allowNull: true,
      // Example: "120/80"
    },
    bodyTemperature: {
      type: DataTypes.FLOAT,
      allowNull: true,
      // Example: 37.5 (Celsius)
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Example: 72 (beats per minute)
    },
    measurementTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: true }
);

module.exports = VitalSigns;
