const notificationModel = require("../models/notificationModel");
// const { createdAt } = require("../utils/formattedTime");
const date = require("date-and-time");
const sequelize = require("../config/database");
const Sequelize = require("sequelize");
const userModel = require("../models/userModel");
const rolesList = require("../constants/rolesList");
const statusList = require("../constants/statusList");

const addNotification = async ({ content, user }) => {
  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const doctors = await userModel.findAll({
      where: { role: rolesList.doctor, status: statusList.approved },
    });

    if (user === "nurse") {
      await Promise.all(
        doctors.map(async (doctor) => {
          await notificationModel.create({
            user_id: doctor.id,
            message: content,
            is_read: 0,
            createdAt: sequelize.literal(`'${formattedDate}'`),
          });
        })
      );
    }

    if (user === "doctor") {
      const nurses = await userModel.findAll({
        where: { role: rolesList.nurse, status: statusList.approved },
      });

      await Promise.all(
        nurses.map(async (nurse) => {
          await notificationModel.create({
            user_id: nurse.id,
            message: content,
            is_read: 0,
            createdAt: sequelize.literal(`'${formattedDate}'`),
          });
        })
      );
    }

    // const nurses = await userModel.findAll({
    //   where: { role: rolesList.nurse, status: statusList.approved },
    // });

    // await Promise.all(
    //   nurses.map(async (nurse) => {
    //     await notificationModel.create({
    //       user_id: nurse.id,
    //       message: content,
    //       is_read: 0,
    //       createdAt: sequelize.literal(`'${formattedDate}'`),
    //     });
    //   })
    // );

    return true; // Return the created notification
  } catch (err) {
    throw new Error(err.message); // Throw an error if something goes wrong
  }
};

const newRegisterNotification = async ({ role, name }) => {
  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const admin = await userModel.findAll({
      where: {
        role: 1,
        [Sequelize.Op.or]: [
          {
            status: statusList.verified,
          },
          {
            status: statusList.approved,
          },
        ],
      },
    });

    await Promise.all(
      admin?.map(async (admin) => {
        await notificationModel.create({
          adminId: role,
          user_id: admin.id,
          message: `New user has registered. Please review and approve the account of ${name}.`,
          is_read: 0,
          createdAt: sequelize.literal(`'${formattedDate}'`),
        });
      })
    );
    return true;
  } catch (err) {
    throw new Error(err.message); // Throw an error if something goes wrong
  }
};

const updateNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const updateNotification = await notificationModel.update(
      {
        is_read: 1,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json(updateNotification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNotificationById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const getNotifications = await notificationModel.findAll({
      where: {
        user_id: user_id,
      },
    });

    const sortByDate = getNotifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    return res.status(200).json(sortByDate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotificationById,
  addNotification,
  updateNotification,
  newRegisterNotification,
};
