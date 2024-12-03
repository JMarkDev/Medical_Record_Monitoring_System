const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const MedicalHistory = require("./medicalHistoryModel");
const LabResult = require("./labResultModel");
const Treatment = require("./treatmentModel");
const VitalSigns = require("./vitalSignModel");

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    patient_insurance_provider: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    patient_insurance_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Admitted",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "patients",
  }
);

Patient.hasMany(MedicalHistory, { foreignKey: "patientId" });
MedicalHistory.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(LabResult, { foreignKey: "patientId" });
LabResult.belongsTo(Patient, { foreignKey: "patientId" });

Treatment.belongsTo(Patient, {
  foreignKey: "patientId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Patient.hasMany(Treatment, {
  foreignKey: "patientId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// // Relationships
Patient.hasMany(VitalSigns, { foreignKey: "patientId" });
VitalSigns.belongsTo(Patient, { foreignKey: "patientId" });

module.exports = Patient;
