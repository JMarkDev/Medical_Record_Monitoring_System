import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import NoData from "../NoData";
import { useFormat } from "../../hooks/useFormatDate";
import { getUserData } from "../../services/authSlice";
import { useSelector, useDispatch } from "react-redux";
import rolesList from "../../constants/rolesList";
import { FaRegCheckCircle, FaRegEye } from "react-icons/fa";
import { updatePrescriptionStatus } from "../../services/prescriptionSlice";
import { toastUtils } from "../../hooks/useToast";

const PatientTable = ({ prescriptions, fetchUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fullDateFormat } = useFormat();
  const user = useSelector(getUserData);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closeModal = () => {
    setSelectedPrescription(null);
  };

  const openConfirmationModal = (prescription) => {
    setSelectedPrescription(prescription);
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
    setSelectedPrescription(null);
  };

  const handleMarkDone = (id) => {
    dispatch(
      updatePrescriptionStatus({ id, status: "completed", toast: toastUtils() })
    );
    fetchUpdate();
    closeConfirmationModal();
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {prescriptions?.length === 0 ? (
        <NoData />
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Doctor Name</th>
              <th className="px-4 py-3">Diagnosis</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 items-center flex justify-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((patient, index) => (
              <tr
                key={index}
                className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                <td
                  className="px-4 py-4 font-medium text-gray-800 dark:text-gray-200"
                  onClick={() => navigate(`/patient-details/${patient.id}`)}
                >
                  {`${patient.patientName}`}
                </td>
                <td className="px-4 py-4">{patient.doctorName}</td>
                <td className="px-4 py-4">{patient.diagnosis}</td>
                <td className="px-4 py-4">
                  {fullDateFormat(patient.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`${
                      patient.status === "pending"
                        ? "bg-red-500"
                        : "bg-green-500"
                    } text-white py-2  px-4 rounded-full`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-4 flex gap-4 ">
                  <button
                    className="flex items-center bg-gray-300 p-2 px-4 rounded-lg gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => openModal(prescriptions[index])}
                  >
                    <FaRegEye className="w-5 h-5" />
                    View
                  </button>

                  {user.role === rolesList.nurse &&
                    patient.status !== "completed" && (
                      <button
                        className="flex items-center gap-2 bg-gray-300 p-2 px-4 rounded-lg text-green-600 hover:text-green-800 font-medium"
                        onClick={() => openConfirmationModal(patient)}
                      >
                        <FaRegCheckCircle className="w-5 h-5" />
                        Done
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Prescription Modal */}
      {selectedPrescription && !confirmationModal && (
        <div
          className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white mx-5 dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Prescription Details
            </h2>
            <p className="mb-2">
              <strong>Diagnosis:</strong> {selectedPrescription.diagnosis}
            </p>
            <p className="mb-2">
              <strong>Doctor:</strong> {selectedPrescription.doctorName}
            </p>
            <p className="mb-2">
              <strong>Instructions:</strong> {selectedPrescription.instructions}
            </p>
            <div className="mb-4">
              <strong>Medicines:</strong>

              <ul className="list-disc list-inside">
                {(() => {
                  let medicines = selectedPrescription?.medicine;

                  // Parse medicines if it's a JSON string
                  if (typeof medicines === "string") {
                    try {
                      medicines = JSON.parse(medicines);
                    } catch (error) {
                      console.error("Failed to parse medicine:", error);
                      medicines = [];
                    }
                  }

                  return medicines && medicines.length > 0 ? (
                    medicines.map((med, idx) => (
                      <li key={idx}>
                        {`${med.name || "N/A"} - ${med.dosage || "N/A"} - ${
                          med.frequency || "N/A"
                        }`}
                      </li>
                    ))
                  ) : (
                    <li>No medicine information available.</li>
                  );
                })()}
              </ul>
            </div>
            <button
              className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg px-3 py-1"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeConfirmationModal}
        >
          <div
            className="bg-white mx-5 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Mark as Done
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to mark this prescription as done?
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="text-white bg-red-500 hover:bg-red-700 rounded-lg px-4 py-2"
                onClick={closeConfirmationModal}
              >
                Cancel
              </button>
              <button
                className="text-white bg-green-500 hover:bg-green-700 rounded-lg px-4 py-2"
                onClick={() => handleMarkDone(selectedPrescription.id)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PatientTable.propTypes = {
  prescriptions: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func.isRequired,
};

export default PatientTable;
