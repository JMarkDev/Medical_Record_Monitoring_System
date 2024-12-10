const nodemailer = require("nodemailer");
// const { AUTH_EMAIL, AUTH_GENERATED_PASS } = process.env;

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "medicalrecordsmonitoringsystem@gmail.com",
    pass: "moiu qzrl ybkx teog",
  },
});
// AUTH_EMAIL = medicalrecordsmonitoringsystem@gmail.com
// AUTH_GENERATED_PASS = moiu qzrl ybkx teog

// test transporter
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
    console.log(success);
  }
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendEmail,
  closeTransporter: () => transporter.close(), // Add this function to close the transporter
};
