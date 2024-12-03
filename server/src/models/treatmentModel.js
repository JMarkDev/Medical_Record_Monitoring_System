const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Treatment = sequelize.define(
  "Treatment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "patients", // Refers to the Patient model
      //   key: "id",
      // },
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Refers to the User model for doctors
        key: "id",
      },
    },
    treatmentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Example: "Physical Therapy", "Medication", "Surgery"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Detailed description of the treatment
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      // Optional, in case treatment is ongoing
    },
    status: {
      type: DataTypes.ENUM("Pending", "Ongoing", "Completed"),
      defaultValue: "Pending",
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Additional notes related to the treatment
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
    tableName: "treatments",
  }
);

module.exports = Treatment;
