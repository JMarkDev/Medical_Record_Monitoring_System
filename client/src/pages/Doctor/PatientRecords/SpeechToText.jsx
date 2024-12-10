import { useState, useEffect } from "react";
import AudioAnalyser from "react-audio-analyser";
import axios from "axios";
import api from "../../../api/axios";
import { FaMicrophone, FaPause, FaStop, FaPlay } from "react-icons/fa";
import PropTypes from "prop-types";

const AudioRecorder = ({ handleTranscription }) => {
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // Timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Timer state

  useEffect(() => {
    handleTranscription(transcription);
  }, [transcription, handleTranscription]);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const controlAudio = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === "recording") {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
    if (newStatus === "inactive") {
      setRecordingTime(0); // Reset timer on stop
    }
  };

  const pollTranscription = async (transcriptionId) => {
    try {
      const response = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptionId}`,
        {
          headers: { authorization: "0d3941fc3b8c4525b6bfc327a35c1e5d" },
        }
      );

      if (response.data.status === "completed") {
        setTranscription(response.data.text);
        setIsLoading(false);
      } else if (response.data.status === "failed") {
        console.error("Transcription failed:", response.data.error);
        setTranscription("Transcription failed.");
        setIsLoading(false);
      } else {
        setTimeout(() => pollTranscription(transcriptionId), 1000);
      }
    } catch (error) {
      console.error("Error polling transcription:", error.message);
      setTranscription("Error polling transcription.");
      setIsLoading(false);
    }
  };

  const sendAudioToServer = async (audioBlob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.mp3");

      const response = await api.post("/upload-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.transcriptionId) {
        pollTranscription(response.data.transcriptionId);
      } else {
        setTranscription("Failed to upload audio file.");
        setIsLoading(false);
      }
    } catch (error) {
      setTranscription("Error uploading audio file.");
      setIsLoading(false);
    }
  };

  const audioProps = {
    audioType: "audio/mp3",
    status,
    audioSrc,
    timeslice: 1000,
    startCallback: () => console.log("Recording started"),
    pauseCallback: () => console.log("Recording paused"),
    stopCallback: (e) => {
      // setAudioSrc(window.URL.createObjectURL(e));
      sendAudioToServer(e);
    },
    onRecordCallback: () => console.log("Recording audio chunk"),
    errorCallback: (err) => console.error("Recording error", err),
  };

  return (
    <div className=" flex flex-col items-center justify-center bg-gray-50 ">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">
        {status === "recording" ? "Recording..." : "Audio Recorder"}
      </h1>
      <div className="mb-6 flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-600">
          {formatTime(recordingTime)}
        </h2>
      </div>

      <AudioAnalyser {...audioProps}>
        <div className="flex space-x-4 w-full">
          {status === "recording" ? (
            <>
              <button
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full"
                onClick={() => controlAudio("paused")}
              >
                {/* <span className="text-2xl"> </span> <FaPause /> */}
                <span className="text-2xl">
                  {" "}
                  <FaPause />
                </span>
              </button>
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
                onClick={() => controlAudio("inactive")}
              >
                <span className="text-2xl">
                  {" "}
                  <FaStop />
                </span>
              </button>
            </>
          ) : status === "paused" ? (
            <>
              <button
                className="btn bg-green-500 hover:bg-green-600 text-white p-4 rounded-full"
                onClick={() => controlAudio("recording")}
              >
                <span className="text-2xl">
                  {" "}
                  <FaPlay />
                </span>
              </button>
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
                onClick={() => controlAudio("inactive")}
              >
                <span className="text-2xl">
                  {" "}
                  <FaStop />
                </span>
              </button>
            </>
          ) : (
            <button
              className="btn bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full"
              onClick={() => controlAudio("recording")}
            >
              <span className="text-2xl">
                <FaMicrophone />
              </span>
            </button>
          )}
        </div>
      </AudioAnalyser>

      <div className="mt-8 w-full ">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="loader w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-600">Transcribing...</p>
          </div>
        ) : (
          <div className="bg-white py-2 rounded-lg shadow-lg">
            <label
              htmlFor="transcription"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Transcription
            </label>
            <textarea
              id="transcription"
              className={`w-full p-3 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                transcription
                  ? "bg-white border-gray-300"
                  : "bg-gray-100 border-gray-200 cursor-not-allowed"
              }`}
              defaultValue={transcription || "No transcription available yet."}
              disabled={!transcription}
              rows={5}
            />
            {transcription && (
              <p className="text-sm text-gray-500 mt-2">
                You can edit the transcription above if necessary.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

AudioRecorder.propTypes = {
  handleTranscription: PropTypes.func,
};

export default AudioRecorder;
