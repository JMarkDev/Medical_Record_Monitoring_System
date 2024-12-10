import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";
import PropTypes from "prop-types";
import { useToast } from "../../../hooks/useToast";
import Loader from "../../../components/loader/loginloader/LoginLoading";
import { getUserData } from "../../../services/authSlice";
import {
  getAllPatients,
  fetchAllPatients,
  reset,
  searchPatient,
} from "../../../services/patientSlice";
import { useDispatch } from "react-redux";

const AddPrescription = ({ isOpen, onClose, fetchUpdate }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [patientList, setPatientList] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [patientName, setPatientName] = useState("");
  const user = useSelector(getUserData);
  const [doctorName, setDoctorName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const patients = useSelector(getAllPatients);
  const [status, setStatus] = useState("Admitted");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (patients) {
      setPatientList(patients);
    }
  }, [patients]);

  useEffect(() => {
    if (status) {
      dispatch(fetchAllPatients(status));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchPatient({ searchQuery: searchTerm, status: status }));
    } else {
      dispatch(fetchAllPatients(status));
    }
  }, [searchTerm, dispatch, status]);

  useEffect(() => {
    if (user) {
      setDoctorName(
        `${user.firstName} ${user.middleInitial}. ${user.lastName}`
      );
    }
  }, [user]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "" }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      patientId,
      patientName,
      doctorId: user.id,
      doctorName,
      diagnosis,
      medicines,
      instructions,
    };

    try {
      const response = await api.post("/prescriptions/add", data);
      if (response.data.status === "success") {
        fetchUpdate();
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add prescription");
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
      toast.error("An error occurred while adding prescription");
    } finally {
      setLoading(false);
    }
  };

  //   const handleFocus = () => {
  //     if (data.customerName) {
  //       setSearchTerm(data.customerName);
  //     }
  //   };

  const handleBlur = () => {
    setPatientList([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-5 overflow-y-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-50">
            <Loader />
          </div>
        )}
        <div className="flex flex-col h-[600px] overflow-y-auto">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-semibold">Add Prescription</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* <div>
              <label className="block text-sm font-medium">Patient Name</label>
              <select name="" id="">
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="relative mt-2">
              <label className="block text-sm font-medium">Patient Name</label>
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  dispatch(searchPatient({ searchQuery: e.target.value }));
                }}
                onBlur={handleBlur} // Close dropdown on blur
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />

              {patientList.length > 0 && (
                <div className="absolute left-0 top-[65px] z-10 border-gray-300 border rounded-lg bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 w-full max-h-52 overflow-y-auto">
                  {patientList.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setPatientName(
                          `${patient.firstName} ${patient.lastName}`
                        );
                        setPatientId(patient.id);
                        setPatientList([]);
                      }}
                    >
                      {patient.firstName} {patient.lastName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Diagnosis</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g., Viral fever, Hypertension, Diabetes"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Medicines</label>
              {medicines.map((medicine, index) => (
                <div key={index} className="flex w-full gap-3 mt-2">
                  <input
                    type="text"
                    placeholder="e.g., Paracetamol, Amoxicillin"
                    value={medicine.name}
                    onChange={(e) =>
                      handleMedicineChange(index, "name", e.target.value)
                    }
                    required
                    className="flex-1 w-1/4 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="e.g., 500mg, 10ml"
                    value={medicine.dosage}
                    onChange={(e) =>
                      handleMedicineChange(index, "dosage", e.target.value)
                    }
                    required
                    className="flex-1 w-1/4 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="e.g., Once daily, After meals"
                    value={medicine.frequency}
                    onChange={(e) =>
                      handleMedicineChange(index, "frequency", e.target.value)
                    }
                    required
                    className="flex-1 p-2 w-1/4 border border-gray-300 rounded-md"
                  />
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="p-2 bg-red-600 text-white rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMedicine}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add Medicine
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium">Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                placeholder="e.g., Drink plenty of water, complete the full course of medication, avoid alcohol."
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

AddPrescription.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  //   id: PropTypes.number.isRequired,
  fetchUpdate: PropTypes.func.isRequired,
};

export default AddPrescription;
