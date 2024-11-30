const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const saltsRounds = 10;
const sequelize = require("../config/database");
const { Op } = require("sequelize");
require("dotenv").config();
const fs = require("fs");
const date = require("date-and-time");
const { setTokens } = require("../helpers/tokenHelpers");
const statusList = require("../constants/statusList");
const otpController = require("./otpController");
const rolesList = require("../constants/rolesList");

const handleRegister = async (req, res) => {
  const {
    image,
    firstName,
    lastName,
    middleInitial,
    email,
    contactNumber,
    address,
    specialization,
    availability_start_day,
    availability_end_day,
    availability_start_time,
    availability_end_time,
    role,
    password,
  } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email: email,
        [Op.or]: [
          { status: statusList.verified },
          { status: statusList.approved },
        ],
        // status: statusList.verified,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    await userModel.destroy({
      where: {
        email: email,
        status: statusList.pending,
      },
    });

    // send OTP to email
    await otpController.postOTP(email);

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    // upload image
    let newFileName = null;
    if (req.file) {
      let filetype = req.file.mimetype.split("/")[1];
      newFileName = req.file.filename + "." + filetype;
      fs.rename(
        `./uploads/${req.file.filename}`,
        `./uploads/${newFileName}`,
        async (err) => {
          if (err) throw err;
          console.log("uploaded successfully");
        }
      );
    }

    const hashPassword = await bcrypt.hash(password, saltsRounds);

    await userModel.create({
      image: newFileName ? `/uploads/${newFileName}` : null,
      firstName,
      lastName,
      middleInitial,
      email,
      contactNumber,
      role,
      address,
      specialization: specialization ? specialization : null,
      availability_start_day: availability_start_day
        ? availability_start_day
        : null,
      availability_end_day: availability_end_day ? availability_end_day : null,
      availability_start_time: availability_start_time
        ? availability_start_time
        : null,
      availability_end_time: availability_end_time
        ? availability_end_time
        : null,
      status: statusList.pending,
      password: hashPassword,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      status: "success",
      message: `Verification OTP sent to ${email}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Register error in server" });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email: email,
        status: statusList.verified,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      //  generate tokens
      if (
        user.role === rolesList.doctor &&
        user.status === statusList.verified
      ) {
        return res.status(400).json({
          message: "Please wait for the admin to approve your account.",
        });
      }

      if (
        user.role === rolesList.nurse &&
        user.status === statusList.verified
      ) {
        return res.status(400).json({
          message: "Please wait for the admin to approve your account.",
        });
      }

      const tokens = setTokens(res, { email, role: user.role });
      accessToken = tokens.accessToken;

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        role: user.role,
        accessToken: accessToken,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Login error in server" });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ status: "success", message: "Logout successful" });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
};
