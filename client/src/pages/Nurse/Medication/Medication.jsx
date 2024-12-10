import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Pagination from "../../../components/Pagination";
import api from "../../../api/axios";
import rolesList from "../../../constants/rolesList";
import { getUserData } from "../../../services/authSlice";
import { useSelector } from "react-redux";
import { FaRegCheckCircle, FaRegEye } from "react-icons/fa";
import { useToast } from "../../../hooks/useToast";

const PatientRecords = () => {
  const user = useSelector(getUserData);
  const toast = useToast();
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const dataPerPage = 10;

  const fetchMedications = async () => {
    try {
      const response = await api.get("/medications/get-all");
      setMedications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const searchMedication = async () => {
      try {
        const response = await api.get(`/medications/search/${searchTerm}`);
        if (response.data.status === "success") {
          setMedications(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (searchTerm) {
      searchMedication();
    } else {
      fetchMedications();
    }
  }, [searchTerm]);

  const openModal = (medication) => {
    setSelectedMedication(medication);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
  };

  const openConfirmationModal = (prescription) => {
    setSelectedPrescription(prescription);
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
    setSelectedPrescription(null);
  };

  const handleMarkDone = async (id) => {
    try {
      const response = await api.put(`/medications/update-status/${id}`, {
        status: "completed",
      });
      if (response.data.status === "success") {
        fetchMedications();
        closeConfirmationModal();
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filtered data based on search term
  // const filteredData = medications.filter(
  //   (med) =>
  //     med.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     med.transcription.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Pagination logic
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = medications.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex text-sm md:text-[16px] justify-between  lg:flex-row flex-col gap-5">
        <div className=" flex max-w-[450px] w-full items-center relative">
          <input
            type="text"
            placeholder="Search by patient name or doctor name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-blue-500 focus:border-blue rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <IoSearch className="text-2xl absolute right-2 text-gray-600" />
        </div>
      </div>
      <div className="mt-8">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Doctor Name</th>
                <th className="px-4 py-3">Transcription</th>
                <th className="px-4 py-3">Medication Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((medication) => (
                <tr
                  key={medication.id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-200"
                >
                  <td className="px-4 py-4 font-medium text-gray-800 dark:text-gray-200">
                    {medication.patientName}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 dark:text-gray-200">
                    {medication.doctorName}
                  </td>
                  <td
                    className="px-4 py-4 font-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-xs text-gray-800 dark:text-gray-200"
                    // title={medication.transcription} // Show full content on hover
                  >
                    {medication.transcription}
                  </td>
                  <td className="px-4 py-4">{medication.medicationDate}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`${
                        medication.status === "pending"
                          ? "bg-red-500"
                          : "bg-green-500"
                      } text-white py-2 px-4 rounded-full`}
                    >
                      {medication.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-3 text-center">
                    <button
                      className="flex items-center bg-gray-300 p-2 px-4 rounded-lg gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => openModal(medication)}
                    >
                      <FaRegEye className="w-5 h-5" />
                      View
                    </button>

                    {user.role === rolesList.nurse &&
                      medication.status !== "completed" && (
                        <button
                          className="flex items-center gap-2 bg-gray-300 p-2 px-4 rounded-lg text-green-600 hover:text-green-800 font-medium"
                          onClick={() => openConfirmationModal(medication)}

                          // onClick={() => handleUpdateStatus(medication.id)}
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
        </div>
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={medications.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMedication && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white mx-5 dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Medication Details
            </h2>
            <p className="mb-2">
              <strong>Patient Name:</strong> {selectedMedication.patientName}
            </p>
            <p className="mb-2">
              <strong>Doctor Name:</strong> {selectedMedication.doctorName}
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {selectedMedication.medicationDate}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {selectedMedication.status}
            </p>
            <p className="mb-4">
              <strong>Transcription:</strong> {selectedMedication.transcription}
            </p>
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

export default PatientRecords;
