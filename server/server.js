const express = require("express");
const database = require("./src/config/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const verifyToken = require("./src/middlewares/verifyToken");
const refreshToken = require("./src/middlewares/refreshToken");
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const notificationRoute = require("./src/routes/notificationRoute");
const appointmentRoute = require("./src/routes/appointmentRoute");
const doctorsRoute = require("./src/routes/doctorsRoute");
const patientRoute = require("./src/routes/patientRoute");
const vitalRoute = require("./src/routes/vitalRoute");
const labResultRoute = require("./src/routes/labResultsRoute");
const medicationRoute = require("./src/routes/medicationRoute");
const prescriptionRoute = require("./src/routes/prescriptionRoute");
const diagnosisRoute = require("./src/routes/diagnosisRoute");
const bladder_bowel_diaryRoute = require("./src/routes/bladder_bowelRoute");

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

const multer = require("multer");
// const { AssemblyAI } = require("assemblyai");
const fs = require("fs");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://192.168.1.9:3000",
    "http://192.168.1.9:3000",
    "http://localhost:3000",
    "https://zp77sd4z-3000.asse.devtunnels.ms",
  ],
  // origin: ["http://192.168.1.8:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
// built in middleware the handle urlencoded data
// in other words form data;
// 'content-type: application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(`${__dirname}/uploads/${filename}`);
});

// public routes no token required

app.use("/auth", authRoute);
app.use("/doctors", doctorsRoute);
app.use("/appointment", appointmentRoute);

// refresh token route
app.post("/refresh", refreshToken, async (req, res) => {
  return res.json({ message: "refresh" });
});

//protected route
app.use("/protected", verifyToken, async (req, res) => {
  return res.json({
    user: req.user,
    message: "You are authorized to access this protected resources.",
  });
});

// check verify user middleware
app.use(verifyToken);

app.use("/users", userRoute);
app.use("/notification", notificationRoute);
app.use("/patients", patientRoute);
app.use("/vitals", vitalRoute);
app.use("/lab-results", labResultRoute);
app.use("/medications", medicationRoute);
app.use("/prescriptions", prescriptionRoute);
app.use("/diagnoses", diagnosisRoute);
app.use("/bladder-bowel", bladder_bowel_diaryRoute);

if (!ASSEMBLYAI_API_KEY) {
  console.error("AssemblyAI API key is missing. Add it to .env file.");
  process.exit(1);
}

// Setup multer for handling file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Route to handle the uploaded audio file
app.post("/upload-audio", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.file.filename);
  console.log(`Audio file uploaded: ${filePath}`);

  try {
    const audioStream = fs.createReadStream(filePath);
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      audioStream,
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const audioUrl = uploadResponse.data.upload_url;
    console.log(`Audio file uploaded to AssemblyAI: ${audioUrl}`);

    // Request transcription
    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: audioUrl },
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;
    console.log("Transcription started. ID:", transcriptId);

    // Return transcription ID to frontend
    res.status(200).json({
      message: "Audio file processed successfully",
      transcriptionId: transcriptId,
    });

    // Start polling for transcription results
    // pollTranscription(transcriptId, res.socket); // Pass socket to polling function
  } catch (error) {
    console.error("Error processing audio file:", error.message);
    res.status(500).json({ message: "Error processing audio file" });
  }
});

app.get("/");
// Server setup
const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://192.168.1.9:3000",
      "http://localhost:3000",
      "https://zp77sd4z-3000.asse.devtunnels.ms",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Save socket reference to use in transcription polling
  // app.use((req, res, next) => {
  //   res.socket = socket; // Attach socket to response object
  //   next();
  // });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("new_notification", (data) => {
    socket.broadcast.emit("success_notification", data);
  });

  socket.on("new_patient", (data) => {
    socket.broadcast.emit("success_add_patient", data);
  });

  socket.on("new_appointment", (data) => {
    socket.broadcast.emit("success_appointment", data);
  });

  socket.on("new_medication", (data) => {
    socket.broadcast.emit("success_medication", data);
  });

  socket.on("update_patient_status", (data) => {
    socket.broadcast.emit("success_update", data);
  });
});

// if (process.env.DEVELOPMENT !== "test") {
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  database.authenticate();
  database
    .sync({ force: false }) // delelte all data in the database
    // .sync({ alter: true })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Error connecting to the database: ", error);
    });
});
// }

module.exports = app;
// add seeders and use id that already exit in database when it have foreignkey
