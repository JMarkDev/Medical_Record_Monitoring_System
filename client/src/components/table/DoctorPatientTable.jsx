import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import NoData from "../NoData";
import { useFormat } from "../../hooks/useFormatDate";
import { useState } from "react";
import AddLabResults from "../../pages/Doctor/PatientRecords/AddLabResults";
import AddMedicationModal from "../../pages/Doctor/PatientRecords/AddMedication";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import AddDiagnosis from "../../pages/Doctor/PatientRecords/AddDiagnosis";
// import AddPrescription from "../../pages/Doctor/PatientRecords/AddPrescription";

const PatientTable = ({ patients }) => {
  const navigate = useNavigate();
  const { fullDateFormat } = useFormat();
  const [showAddLabResults, setShowAddLabResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddDiagnosis, setShowAddDiagnosis] = useState(false);
  // const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [patientName, setPatientName] = useState("");

  const openAddLabResults = (id) => {
    setShowAddLabResults(true);
    setSelectedPatient(id);
  };

  const closeAddLabResults = () => {
    setShowAddLabResults(false);
    setSelectedPatient(null);
  };

  const openAddDiagnosis = (id) => {
    setShowAddDiagnosis(true);
    setSelectedPatient(id);
  };

  const closeAddDiagnosis = () => {
    setShowAddDiagnosis(false);
    setSelectedPatient(null);
  };

  const openAddMedication = (id) => {
    setShowAddMedication(true);
    setSelectedPatient(id);

    // Find the patient by ID and extract their first and last names
    const patient = patients.find((patient) => patient.id === id);
    if (patient) {
      const fullName = `${patient.firstName} ${patient.lastName}`;
      setPatientName(fullName); // Set the full name in the state
    }
  };

  const closeAddMedication = () => {
    setShowAddMedication(false);
    setSelectedPatient(null);
  };

  // const openAddPrescription = (id) => {
  //   setShowAddPrescription(true);
  //   setSelectedPatient(id);
  // };

  // const closeAddPrescription = () => {
  //   setShowAddPrescription(false);
  //   setSelectedPatient(null);
  // };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {patients?.length === 0 ? (
        <NoData />
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Date of Birth</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Contact Number</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={index}
                className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/patient-details/${patient.id}`)}
              >
                <td className="px-4 py-4   font-medium text-gray-800 dark:text-gray-200">
                  {`${patient.firstName} ${patient.lastName}`}
                </td>
                <td className="px-4 py-4 text-nowrap">
                  {fullDateFormat(patient.dateOfBirth)}
                </td>
                <td className="px-4 py-4">{patient.gender}</td>
                <td className="px-4 py-4">{patient.contactNumber}</td>
                <td className="px-4 py-4">
                  <span
                    className={`p-2 rounded-lg text-white ${
                      patient.status === "Admitted"
                        ? "bg-green-400"
                        : patient.status === "Transferred"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                {/* <td className="px-4 py-4 overflow-hidden text-ellipsis max-w-xs">
                  {patient.address}
                </td> */}
                <td className="px-4 text-nowrap py-4 flex gap-3 whitespace-nowrap items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate(`/patient-lab-results/${patient.id}`);
                      openAddLabResults(patient.id);
                    }}
                    className="p-2 flex items-center text-nowrap text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <IoMdAddCircleOutline className="text-lg" /> Lab Results
                  </button>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate(`/patient-lab-results/${patient.id}`);
                      openAddPrescription(patient.id);
                    }}
                    className="p-2 flex items-center text-nowrap text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                  >
                    <IoMdAddCircleOutline className="text-lg" />
                    Prescription
                  </button> */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate(`/patient-lab-results/${patient.id}`);
                      openAddDiagnosis(patient.id);
                    }}
                    className="p-2 flex items-center text-nowrap text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    <IoMdAddCircleOutline className="text-lg" /> Dianosis
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddMedication(patient.id);
                    }}
                    className="p-2 flex items-center text-nowrap text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                  >
                    <FaMicrophone className="text-lg" /> Medication
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showAddLabResults && (
        <AddLabResults
          isOpen={showAddLabResults}
          onClose={closeAddLabResults}
          id={selectedPatient}
        />
      )}

      {showAddDiagnosis && (
        <AddDiagnosis
          isOpen={showAddDiagnosis}
          onClose={closeAddDiagnosis}
          id={selectedPatient}
        />
      )}

      {showAddMedication && (
        <AddMedicationModal
          isOpen={showAddMedication}
          onClose={closeAddMedication}
          id={selectedPatient}
          patientName={patientName}
        />
      )}

      {/* {showAddPrescription && (
        <AddPrescription
          isOpen={showAddPrescription}
          onClose={closeAddPrescription}
          id={selectedPatient}
        />
      )} */}
    </div>
  );
};

PatientTable.propTypes = {
  patients: PropTypes.array.isRequired,
};

export default PatientTable;
