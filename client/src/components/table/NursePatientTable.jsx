import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import NoData from "../NoData";
import Loader from "../loader/loginloader/LoginLoading";
import api from "../../api/axios";
import { getUserData } from "../../services/authSlice";
import { useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import { IoMdAddCircleOutline } from "react-icons/io";

const PatientTable = ({ patients }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const user = useSelector(getUserData);
  const [showModal, setShowModal] = useState(false);
  const [showBladderModal, setBladderModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [temperatureError, setTemperatureError] = useState("");
  const [bloodPressureError, setBloodPressureError] = useState("");
  const [heartbeatError, setHeartbeatError] = useState("");

  const [vitals, setVitals] = useState({
    bodyTemperature: "",
    bloodPressure: "",
    heartRate: "",
    nurseId: null,
    nurseName: "",
    patientId: null,
  });

  const [diary, setDiary] = useState({
    patientId: "",
    patientName: "",
    nurseId: user?.id,
    nurseName: `${user?.firstName} ${user?.middleInitial}. ${user?.lastName}`,
    waterIntake: "",
    urineVolume: "",
    voidFrequency: "",
    urinarySymptoms: "",
    stoolFrequency: "",
    stoolConsistency: "",
    bowelSymptoms: "",
    notes: "",
  });

  const handleAddVitalsClick = (patient) => {
    {
      user &&
        setVitals({
          ...vitals,
          nurseId: user.id,
          nurseName: `${user.firstName} ${user.middleInitial}. ${user.lastName}`,
          patientId: patient.id,
        });
    }
    setBladderModal(false);
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleAddRecord = (patient) => {
    setBladderModal(true);
    setShowModal(false);
    setSelectedPatient(patient);
    setDiary({
      ...diary,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
    });
  };

  const handleAddVitals = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    setTemperatureError("");
    setBloodPressureError("");
    setHeartbeatError("");
    try {
      const response = await api.post("/vitals/add-vitals", vitals);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setLoading(false); // Hide loader
        handleCloseModal();
      }
    } catch (error) {
      setLoading(false); // Hide loader
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "bodyTemperature":
              setTemperatureError(error.msg);
              break;
            case "bloodPressure":
              setBloodPressureError(error.msg);
              break;
            case "heartRate":
              setHeartbeatError(error.msg);
              break;
            default:
              toast.error("An error occurred. Please try again.", {
                position: "top-right",
              });
              break;
          }
        });
      }
    }
  };

  const handleAddDiary = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/bladder-bowel/add", diary);
      if (response.data.status === "success") {
        setLoading(false);
        handleCloseModal();
        toast.success(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setLoading(false);
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedPatient(null); // Clear the selected patient
    setBladderModal(false);
    setVitals({
      bodyTemperature: "",
      bloodPressure: "",
      heartRate: "",
      nurseId: null,
      nurseName: "",
      patientId: null,
    });
    setDiary({
      patientId: "",
      patientName: "",
      waterIntake: "",
      urineVolume: "",
      voidFrequency: "",
      urinarySymptoms: "",
      stoolFrequency: "",
      stoolConsistency: "",
      bowelSymptoms: "",
      notes: "",
    });
    setTemperatureError("");
    setBloodPressureError("");
    setHeartbeatError("");
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {patients?.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  FULL NAME
                </th>
                <th scope="col" className="px-4 py-3">
                  CONTACT NUMBER
                </th>
                {/* <th scope="col" className="px-4 py-3">
                  ADDRESS
                </th> */}
                <th scope="col" className="px-4 py-3">
                  DATE OF BIRTH
                </th>
                <th scope="col" className="px-4 py-3">
                  GENDER
                </th>
                <th scope="col" className="px-4 py-3">
                  STATUS
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {patients?.map((patient, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate(`/patient-details/${patient.id}`)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">{`${patient.firstName} ${patient.lastName}`}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {patient.contactNumber}
                  </td>
                  {/* <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                    {patient.address}
                  </td> */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {patient.dateOfBirth}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {patient.gender}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 flex gap-3 whitespace-nowrap justify-center items-center relative">
                    <button
                      onClick={() => navigate(`/patient-details/${patient.id}`)}
                      className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleAddVitalsClick(patient);
                      }}
                      className=" p-2 text-nowrap whitespace-normal flex items-center gap-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <IoMdAddCircleOutline className="text-lg" /> Vitals
                    </button>
                    <button
                      onClick={(e) => {
                        handleAddRecord(patient);
                        e.stopPropagation(); // Prevent any parent click events
                      }}
                      className=" p-2 bg-yellow-500 text-white flex items-center gap-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                    >
                      <IoMdAddCircleOutline className="text-lg" /> Bladder/Bowel
                      Diary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {loading && <Loader />}
          <div className="bg-white mx-5 p-6 rounded-md w-96 shadow-md">
            <h2 className="text-lg font-bold mb-4">
              Record Vitals for {selectedPatient.firstName}{" "}
              {selectedPatient.lastName}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Temperature
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setVitals({ ...vitals, bodyTemperature: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    temperatureError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  placeholder="Enter temperature"
                />
                {temperatureError && (
                  <p className="text-red-500 text-sm">{temperatureError}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setVitals({ ...vitals, bloodPressure: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    bloodPressureError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  placeholder="Enter blood pressure"
                />
                {bloodPressureError && (
                  <p className="text-red-500 text-sm">{bloodPressureError}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Heartbeat
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setVitals({ ...vitals, heartRate: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    heartbeatError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  placeholder="Enter heartbeat"
                />
                {heartbeatError && (
                  <p className="text-red-500 text-sm">{heartbeatError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddVitals}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBladderModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          {loading && <Loader />}
          <div className="bg-white h-full overflow-y-auto p-6 rounded-lg shadow-md max-w-2xl w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
              Record Bladder and Bowel Diary
            </h2>
            <p className="text-center text-gray-600 mb-4">
              For {selectedPatient.firstName} {selectedPatient.lastName}
            </p>
            <form onSubmit={handleAddDiary}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Water Intake Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Water Intake (times/day)
                  </label>
                  <input
                    type="number"
                    required
                    value={diary.waterIntake}
                    onChange={(e) =>
                      setDiary({ ...diary, waterIntake: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 8"
                  />
                </div>

                {/* Urine Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Urine Volume (ml)
                  </label>
                  <input
                    type="number"
                    required
                    value={diary.urineVolume}
                    onChange={(e) =>
                      setDiary({ ...diary, urineVolume: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 250 ml"
                  />
                </div>

                {/* Void Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Void Frequency (times/day)
                  </label>
                  <input
                    type="number"
                    required
                    value={diary.voidFrequency}
                    onChange={(e) =>
                      setDiary({ ...diary, voidFrequency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 6"
                  />
                </div>

                {/* Urinary Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Urinary Symptoms
                  </label>
                  <input
                    type="text"
                    required
                    value={diary.urinarySymptoms}
                    onChange={(e) =>
                      setDiary({
                        ...diary,
                        urinarySymptoms: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., pain, burning"
                  />
                </div>

                {/* Stool Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stool Frequency (times/day)
                  </label>
                  <input
                    type="number"
                    required
                    value={diary.stoolFrequency}
                    onChange={(e) =>
                      setDiary({ ...diary, stoolFrequency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., 2"
                  />
                </div>

                {/* Stool Consistency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stool Consistency
                  </label>
                  <select
                    value={diary.stoolConsistency}
                    required
                    onChange={(e) =>
                      setDiary({ ...diary, stoolConsistency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select consistency</option>
                    <option value="hard">Hard</option>
                    <option value="normal">Normal</option>
                    <option value="loose">Loose</option>
                    <option value="watery">Watery</option>
                  </select>
                </div>

                {/* Bowel Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bowel Symptoms
                  </label>
                  <input
                    type="text"
                    required
                    value={diary.bowelSymptoms}
                    onChange={(e) =>
                      setDiary({
                        ...diary,
                        bowelSymptoms: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., pain, blood"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={diary.notes}
                  onChange={(e) =>
                    setDiary({ ...diary, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  placeholder="e.g., any additional observations"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddDiary}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

PatientTable.propTypes = {
  patients: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func,
  patientStatus: PropTypes.string,
};

export default PatientTable;
