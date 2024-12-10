const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Diagnosis = sequelize.define(
  "Diagnosis",
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
    diagnosisName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Example: "Pneumonia"
    },
    doctorName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Example: "Dr. John
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Example: "Infection affecting the lungs causing difficulty in breathing."
    },
    diagnosisDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // Example: "2024-12-01"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Example: "Patient needs bed rest and hydration. Follow up in two weeks."
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
    tableName: "diagnoses",
  }
);

module.exports = Diagnosis;
