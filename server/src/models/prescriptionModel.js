const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Prescription = sequelize.define(
  "Prescription",
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
        model: "patients", // Refers to the Patient model
        key: "id",
      },
    },
    patientName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Refers to the Doctor (User) model
        key: "id",
      },
    },
    doctorName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    diagnosis: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    medicine: {
      type: DataTypes.JSON,
      allowNull: false,
      // Example format: [{ name: "Paracetamol", dosage: "500mg", frequency: "3x a day" }]
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Example: "Complete the full course of antibiotics."
    },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "prescriptions",
  }
);

module.exports = Prescription;
