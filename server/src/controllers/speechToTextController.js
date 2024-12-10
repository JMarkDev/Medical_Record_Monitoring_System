const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const ASSEMBLYAI_API_KEY = "0d3941fc3b8c4525b6bfc327a35c1e5d"; // Replace with your actual API Key

if (!ASSEMBLYAI_API_KEY) {
  console.error("AssemblyAI API key is missing. Add it to .env file.");
  process.exit(1);
}

// Route to handle the uploaded audio file
const uploadVoiceRecord = async (req, res) => {
  const filePath = path.join(__dirname, "../../uploads", req.file.filename);
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
};

module.exports = {
  uploadVoiceRecord,
};
