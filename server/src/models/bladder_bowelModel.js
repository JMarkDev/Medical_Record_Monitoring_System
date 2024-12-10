const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const BladderBowelDiary = sequelize.define(
  "bladder_bowel_diary",
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
    patientName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // The name of the patient
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
      type: DataTypes.STRING(255),
      allowNull: false,
      // The name of the nurse
    },
    // date: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: false,
    //   // The date the entry pertains to
    // },
    // time: {
    //   type: DataTypes.TIME,
    //   allowNull: false,
    //   // The time of the diary entry
    // },
    waterIntake: {
      type: DataTypes.FLOAT,
      allowNull: true,
      // Volume of water in milliliters
    },
    // Bladder Diary Fields
    urineVolume: {
      type: DataTypes.FLOAT,
      allowNull: true,
      // Volume of urine in milliliters
    },
    voidFrequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Number of voids (urinations) during the day
    },
    urinarySymptoms: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Symptoms like pain, burning, or incontinence
    },
    // Bowel Movement Diary Fields
    stoolFrequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Number of bowel movements during the day
    },
    stoolConsistency: {
      type: DataTypes.ENUM("hard", "normal", "loose", "watery"),
      allowNull: true,
      // Stool consistency, based on standard descriptions
    },
    bowelSymptoms: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Symptoms like pain, blood, or discomfort
    },
    // Shared Fields
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Additional observations by the nurse
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
  { timestamps: true }
);

module.exports = BladderBowelDiary;
