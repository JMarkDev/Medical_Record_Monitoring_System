const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Medication = sequelize.define(
  "Medication",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // Example: 1
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients", // Refers to the Patient model
        key: "id",
      },
      // Example: 101 (Patient ID)
    },
    patientName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Example: "John Doe"
    },
    doctorName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Example: "Dr. Jane
    },
    // medicationName: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
    //   // Example: "Amoxicillin"
    // },
    transcription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   // Example: "Antibiotic used to treat bacterial infections."
    // },
    medicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // Example: "2024-12-01"
    },
    // dosage: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    //   // Example: "500 mg"
    // },
    // frequency: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    //   // Example: "3 times a day"
    // },
    // startDate: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    //   // Example: "2024-12-01"
    // },
    // endDate: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    //   // Example: "2024-12-07"
    // },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
      allowNull: false,
      // Example: "Pending"
    },
    // notes: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   // Example: "Take after meals. Avoid alcohol during medication."
    // },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      // Example: "2024-12-01T10:00:00.000Z"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      // Example: "2024-12-05T15:30:00.000Z"
    },
  },
  {
    timestamps: true,
    tableName: "medications",
  }
);

module.exports = Medication;
