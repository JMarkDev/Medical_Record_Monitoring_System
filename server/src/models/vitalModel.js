const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Vital = sequelize.define(
  "vitals",
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
    nurseName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bloodPressure: {
      type: DataTypes.STRING(20),
      allowNull: false,
      // Example: "120/80"
    },
    bodyTemperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      // Example: 37.5 (Celsius)
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Example: 72 (beats per minute)
    },
    measurementTime: {
      type: DataTypes.DATE,
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

module.exports = Vital;
