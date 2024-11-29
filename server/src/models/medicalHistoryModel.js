const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const MedicalHistory = sequelize.define(
  "medical_history",
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
    condition: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    diagnosisDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      // Example: "Recovered", "Ongoing", "Chronic"
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
  {
    timestamps: true,
    tableName: "medical_history",
    freezeTableName: true,
  }
);

module.exports = MedicalHistory;
