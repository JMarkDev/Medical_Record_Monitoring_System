const { sendEmail } = require("./sendEmail");
const date = require("date-and-time");

const sendNotification = async ({ email, subject, appointmentDetails }) => {
  try {
    if (!email || !subject || !appointmentDetails) {
      throw new Error("Email, subject, and appointment details are required");
    }

    const {
      patientName,
      date: appointmentDate,
      time: appointmentTime,
      doctorName,
    } = appointmentDetails;

    // Format date (e.g., December 1, 2024)
    const parsedDate = date.parse(appointmentDate, "YYYY-MM-DD");
    const formattedDate = date.format(parsedDate, "MMMM D, YYYY");

    // Format time (e.g., 02:30 PM)
    const parsedTime = date.parse(appointmentTime, "HH:mm");
    const formattedTime = date.format(parsedTime, "hh:mm A");

    const mailOptions = {
      from: "medicalrecordsmonitoringsystem@gmail.com",
      to: email,
      subject,
      html: `<p>Dear ${patientName || "Patient"},</p>
      <p>Thank you for booking an appointment with Dr. ${
        doctorName || "your doctor"
      }.</p>
      <p><strong>Appointment Details:</strong></p>
      <p>Date: <strong>${formattedDate}</strong></p>
      <p>Time: <strong>${formattedTime}</strong></p>
      <p>If you have any questions or need to reschedule, please contact us at medicalrecordsmonitoringsystem@gmail.com.</p>
      <p>Best regards,<br>Medical Records Monitoring System</p>`,
    };
    await sendEmail(mailOptions);
  } catch (error) {
    console.error("Error sending notification:", error.message);
    throw error;
  }
};

module.exports = { sendNotification };
