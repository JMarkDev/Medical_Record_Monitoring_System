const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
const {
  loginValidationRules,
  registerValidationRules,
  validateForm,
  validateEmail,
  validateForgotPassword,
  handleValidationErrors,
} = require("../middlewares/formValidation");
const forgotPasswordController = require("../controllers/forgotPasswordController");

router.post(
  "/register",
  upload.single("image"),
  registerValidationRules(),
  handleValidationErrors,
  authController.handleRegister
);
router.post(
  "/login",
  loginValidationRules(),
  validateForm,
  authController.handleLogin
);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/resend-otp", otpController.resendOTP);
router.post("/logout", authController.handleLogout);

router.post(
  "/forgot-password",
  validateEmail(),
  validateForm,
  forgotPasswordController.forgotPasswordOTP
);
router.post("/verify-otp-forgot", forgotPasswordController.verifyOTP);
router.put(
  "/reset-password",
  validateForgotPassword(),
  validateForm,
  forgotPasswordController.resetPassword
);

module.exports = router;
