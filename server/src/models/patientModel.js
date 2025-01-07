const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const LabResult = require("./labResultModel");
const Vital = require("./vitalModel");
const Prescription = require("./prescriptionModel");
const Medication = require("./medicationModel");
const User = require("./userModel");
const Diagnosis = require("./diagnosisModel");
const Bladder_BowelModel = require("./bladder_bowelModel");

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
    admissionReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doctorId: {
      type: DataTypes.JSON,
      allowNull: true,
      // references: {
      //   model: "users",
      //   key: "id",
      // },
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

// Patient and LabResult Relationship
Patient.hasMany(LabResult, { foreignKey: "patientId", onDelete: "CASCADE" });
LabResult.belongsTo(Patient, { foreignKey: "patientId" });

// // Relationships
Patient.hasMany(Vital, { foreignKey: "patientId" });
Vital.belongsTo(Patient, { foreignKey: "patientId" });

// Relationships
// Prescription.hasMany(Medication, {
//   foreignKey: "prescriptionId",
//   onDelete: "CASCADE",
// });
// Medication.belongsTo(Prescription, { foreignKey: "prescriptionId" });

Patient.hasMany(Diagnosis, { foreignKey: "patientId", onDelete: "CASCADE" });
Diagnosis.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(Prescription, { foreignKey: "patientId", onDelete: "CASCADE" });
Prescription.belongsTo(Patient, { foreignKey: "patientId" });

Medication.belongsTo(Patient, { foreignKey: "patientId" }); // Medication belongs to a patient
Patient.hasMany(Medication, { foreignKey: "patientId" }); // A patient can have multiple medications

Patient.hasMany(Bladder_BowelModel, {
  foreignKey: "patientId",
  onDelete: "CASCADE",
});
Bladder_BowelModel.belongsTo(Patient, { foreignKey: "patientId" });

// Patient.belongsTo(User, { foreignKey: "doctorId", onDelete: "CASCADE" });
// User.hasMany(Patient, { foreignKey: "doctorId" });

// User.hasMany(Prescription, { foreignKey: "doctorId", onDelete: "CASCADE" });
// Prescription.belongsTo(User, { foreignKey: "doctorId" });

module.exports = Patient;
