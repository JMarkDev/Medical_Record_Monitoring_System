const { body, validationResult } = require("express-validator");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reusable validation functions
const validateEmail = () => {
  return body("email").custom((value) => {
    if (!value) {
      throw new Error("Email is required");
    }
    if (!value.match(emailRegex)) {
      throw new Error("Enter a valid email address(e.g. sample@gmail.com).");
    }
    return true;
  });
};

const validatePassword = () => {
  return body("password").custom((value) => {
    if (!value) {
      throw new Error("Password is required");
    }
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    return true;
  });
};

const validateForgotPassword = () => {
  return [
    body("password").custom((value) => {
      if (!value) {
        throw new Error("Password is required");
      }
      if (value.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      return true;
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (!value) {
        throw new Error("Confirm password is required");
      }
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
};

const validateRequiredField = (fieldName) => {
  const fieldNameWithSpaces = fieldName
    .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${fieldNameWithSpaces} is required`);
};

// Validation rules for login
const loginValidationRules = () => {
  return [validateEmail(), validateRequiredField("password")];
};

const doctorSpecificValidations = (req) => {
  const errors = [];

  if (!req.body.specialization || req.body.specialization.trim() === "") {
    errors.push({
      path: "specialization",
      msg: "Specialization is required",
    });
  }

  if (!req.body.availability_start_day) {
    errors.push({
      path: "availability_start_day",
      msg: "Availability start day is required",
    });
  }

  if (!req.body.availability_end_day) {
    errors.push({
      path: "availability_end_day",
      msg: "Availability end day is required",
    });
  }

  if (!req.body.availability_start_time) {
    errors.push({
      path: "availability_start_time",
      msg: "Availability start time is required",
    });
  }

  if (!req.body.availability_end_time) {
    errors.push({
      path: "availability_end_time",
      msg: "Availability end time is required",
    });
  }

  return errors;
};

const registerValidationRules = () => {
  return [
    (req, res, next) => {
      // Initialize req.errors at the start of validation
      req.errors = [];
      next();
    },
    body("firstName").notEmpty().withMessage("First Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
    body("middleInitial").notEmpty().withMessage("Middle Initial is required"),
    body("email").custom((value) => {
      if (!value) {
        throw new Error("Email is required");
      }
      if (!value.match(emailRegex)) {
        throw new Error("Enter a valid email address(e.g. sample@gmail.com).");
      }
      return true;
    }),
    body("contactNumber").notEmpty().withMessage("Contact Number is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (!value) {
        throw new Error("Confirm password is required");
      }

      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("role").custom((value, { req }) => {
      const role = parseInt(value, 10);
      if (!role) {
        throw new Error("Role is required");
      }

      // Perform doctor-specific validations if the role is 3
      if (role === 3) {
        const errors = doctorSpecificValidations(req);
        req.errors.push(...errors);
      }
      return true;
    }),
  ];
};

const patientValidationRules = () => {
  return [
    validateRequiredField("firstName"),
    validateRequiredField("lastName"),
    validateRequiredField("contactNumber"),
    validateRequiredField("address"),
    validateRequiredField("dateOfBirth"),
    validateRequiredField("gender"),
    validateRequiredField("status"),
  ];
};

const handleValidationErrors = (req, res, next) => {
  // Collect all validation errors
  const errors = validationResult(req);

  // If errors exist, format them and return
  if (!errors.isEmpty() || req.errors.length > 0) {
    const formattedErrors = [
      ...errors.array(),
      ...req.errors, // Add custom errors from doctorSpecificValidations
    ];

    return res.status(400).json({ errors: formattedErrors });
  }

  next();
};

const updateProfileValidation = () => {
  return [
    validateRequiredField("firstName"),
    validateRequiredField("lastName"),
    validateRequiredField("middleInitial"),
    validateEmail(),
    validateRequiredField("contactNumber"),
  ];
};

// Middleware to validate form
const validateForm = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  loginValidationRules,
  registerValidationRules,
  handleValidationErrors,
  validateForm,
  validateEmail,
  validateForgotPassword,
  updateProfileValidation,
  patientValidationRules,
};
