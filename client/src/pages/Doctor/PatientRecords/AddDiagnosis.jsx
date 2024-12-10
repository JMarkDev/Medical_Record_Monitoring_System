import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";
import PropTypes from "prop-types";
// import { MdDeleteOutline } from "react-icons/md";
import { useToast } from "../../../hooks/useToast";
import Loader from "../../../components/loader/loginloader/LoginLoading";
import { getUserData } from "../../../services/authSlice";

const AddDiagnosis = ({ isOpen, onClose, id }) => {
  const toast = useToast();
  const user = useSelector(getUserData);
  const [doctorName, setDoctorName] = useState("");
  const [diagnosisName, setDiagnosisName] = useState("");
  const [details, setDetails] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDoctorName(
        `${user.firstName} ${user.middleInitial}. ${user.lastName}`
      );
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      patientId: id,
      doctorName,
      diagnosisName,
      details,
      diagnosisDate,
      notes,
    };
    try {
      const response = await api.post("/diagnoses/add", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add diagnosis");
      }
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      toast.error("An error occurred while adding diagnosis");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg max-w-xl w-full mx-5 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-50">
            <Loader />
          </div>
        )}
        <div className="flex flex-col">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-semibold">Add Diagnosis</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Diagnosis Name
              </label>
              <input
                type="text"
                value={diagnosisName}
                onChange={(e) => setDiagnosisName(e.target.value)}
                placeholder="e.g., Pneumonia, Diabetes"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Details</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Provide details about the diagnosis..."
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Diagnosis Date
              </label>
              <input
                type="date"
                value={diagnosisDate}
                onChange={(e) => setDiagnosisDate(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Additional notes or observations..."
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddDiagnosis.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default AddDiagnosis;
