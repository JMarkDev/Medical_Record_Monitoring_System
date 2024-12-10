import { useState } from "react";
import Loader from "../../../components/loader/loginloader/LoginLoading";
import SpeechToText from "./SpeechToText";
import PropTypes from "prop-types";
import api from "../../../api/axios";
import { useToast } from "../../../hooks/useToast";
import { getUserData } from "../../../services/authSlice";
import { useSelector } from "react-redux";

const AddMedicationModal = ({ isOpen, onClose, id, patientName }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [medicationDate, setMedicationDate] = useState("");
  const user = useSelector(getUserData);

  const handleTranscription = (transcription) => {
    setTranscription(transcription);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      patientId: id,
      transcription,
      patientName,
      doctorName: `${user?.firstName} ${user?.middleInitial}. ${user?.lastName}`,
      medicationDate: new Date(medicationDate),
    };

    if (!transcription) {
      toast.error("Please record a transcription");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/medications/record-medication", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      console.error("Error adding medication:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex overflow-y-auto items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white relative rounded-lg w-full max-w-xl flex flex-col mx-5 overflow-hidden">
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-50">
            <Loader />
          </div>
        )}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Medication</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <SpeechToText handleTranscription={handleTranscription} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 ">
            <label htmlFor="medicationDate" className="block font-medium">
              Medication Date
            </label>
            <input
              type="date"
              id="medicationDate"
              value={medicationDate}
              required
              onChange={(e) => setMedicationDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1"
            />
          </div>
        </form>
        {/* Buttons */}
        <div className="px-6 my-3 py-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

AddMedicationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number,
  patientName: PropTypes.string,
};

export default AddMedicationModal;
