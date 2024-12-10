const date = require("date-and-time");
const bladder_bowel_diaryModel = require("../models/bladder_bowelModel");
const sequelize = require("../config/database");

const addBladderBowelDiary = async (req, res) => {
  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const {
      patientId,
      patientName,
      nurseId,
      nurseName,
      waterIntake,
      urineVolume,
      voidFrequency,
      urinarySymptoms,
      stoolFrequency,
      stoolConsistency,
      bowelSymptoms,
      notes,
    } = req.body;

    const newBladderBowelDiary = await bladder_bowel_diaryModel.create({
      patientId,
      patientName,
      nurseId,
      nurseName,
      waterIntake,
      urineVolume,
      voidFrequency,
      urinarySymptoms,
      stoolFrequency,
      stoolConsistency,
      bowelSymptoms,
      notes,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      status: "success",
      message: "Added successfully",
      newBladderBowelDiary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateBladderBowelDiary = async (req, res) => {
  const { id } = req.params;
  const {
    waterIntake,
    urineVolume,
    voidFrequency,
    urinarySymptoms,
    stoolFrequency,
    stoolConsistency,
    bowelSymptoms,
    notes,
  } = req.body;

  try {
    const updatedRows = await bladder_bowel_diaryModel.update(
      {
        waterIntake,
        urineVolume,
        voidFrequency,
        urinarySymptoms,
        stoolFrequency,
        stoolConsistency,
        bowelSymptoms,
        notes,
      },
      {
        where: { id },
      }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getBladderBowelDiaryById = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await bladder_bowel_diaryModel.findOne({
      where: { id },
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.status(200).json({
      status: "success",
      record,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteBladderBowelDiary = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await bladder_bowel_diaryModel.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBladderBowelDiary,
  updateBladderBowelDiary,
  getBladderBowelDiaryById,
  deleteBladderBowelDiary,
};
