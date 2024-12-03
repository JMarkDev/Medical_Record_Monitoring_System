const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Appointment = sequelize.define(
  "appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Assuming doctors are stored in the Users table
        key: "id",
      },
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Assuming doctors are stored in the Users table
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Example: "Consultation", "Follow-up", "Lab Test"
    },
    status: {
      type: DataTypes.ENUM("Scheduled", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Scheduled",
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
    tableName: "appointment",
    freezeTableName: true,
  }
);

module.exports = Appointment;
