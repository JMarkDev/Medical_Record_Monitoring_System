import PropTypes from "prop-types";
import api from "../../../api/axios";
import { useForm } from "react-hook-form";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import LocationInput from "../../../components/Location";
import io from "socket.io-client";
import { getDoctors, fetchApprovedDoctors } from "../../../services/usersSlice";
import { useDispatch, useSelector } from "react-redux";
const socket = io.connect(`${api.defaults.baseURL}`);

const AddPatients = ({ modal, closeModal, fetchUpdate }) => {
  const toast = useToast();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();
  const doctors = useSelector(getDoctors);
  // Error state for backend validation messages
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [customerAddressError, setCustomerAddressError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [status, setStatus] = useState("Admitted");
  const [reasonError, setReasonError] = useState("");
  const [admissionReason, setAdmissionReason] = useState("");
  const [customReasonError, setCustomReasonError] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const handleDoctorSelection = (doctorId) => {
    if (selectedDoctors.includes(doctorId)) {
      setSelectedDoctors(selectedDoctors.filter((id) => id !== doctorId)); // Remove doctor if already selected
    } else {
      setSelectedDoctors([...selectedDoctors, doctorId]); // Add doctor to the selected list
    }
  };

  useEffect(() => {
    dispatch(fetchApprovedDoctors());
  }, [dispatch]);

  const handleLocationChange = (location) => {
    setLocation(location);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    setFirstnameError("");
    setLastnameError("");
    setContactError("");
    setCustomerAddressError("");
    setGenderError("");
    setDateOfBirthError("");
    setStatusError("");
    setReasonError("");

    if (admissionReason === "Others" && !data.customReason) {
      setCustomReasonError("Please specify the reason for admission.");
      setLoading(false);
      return;
    }

    // Use customReason if "Others" is selected
    if (admissionReason === "Others") {
      data.admissionReason = data.customReason;
    }

    const dateOfBirth = `${data.year}-${String(data.month).padStart(
      2,
      "0"
    )}-${String(data.day).padStart(2, "0")}`;
    data.dateOfBirth = dateOfBirth;
    data.address = location;
    data.doctorId = selectedDoctors;
    console.log(data);

    try {
      const response = await api.post("/patients/add-patient", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        socket.emit("new_patient", response.data);
        setTimeout(() => {
          closeModal(false);
          fetchUpdate();
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "firstName":
              setFirstnameError(error.msg);
              break;
            case "lastName":
              setLastnameError(error.msg);
              break;
            case "contactNumber":
              setContactError(error.msg);
              break;
            case "address":
              setCustomerAddressError(error.msg);
              break;
            case "gender":
              setGenderError(error.msg);
              break;
            case "dateOfBirth":
              setDateOfBirthError(error.msg);
              break;
            case "status":
              setStatusError(error.msg);
              break;
            default:
              console.log(error);
          }
        });
      }
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden={!modal}
        className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
      >
        {loading && <LoginLoading />}
        <div className="relative w-full max-w-2xl max-h-full py-5 ">
          <div className="relative text-gray-800 bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-center">
              <h1 className="md:text-2xl font-bold text-lg p-4">New Patient</h1>
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => closeModal(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4  space-y-4 text-sm text-[#221f1f]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
                encType="multipart/form-data"
              >
                <div className="flex justify-between w-full md:flex-row flex-col gap-4 mt-4">
                  <div className="flex flex-col w-full">
                    <div className="">
                      <label
                        htmlFor="date_of_birth"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        First Name
                      </label>
                      <input
                        {...register("firstName")}
                        type="text"
                        id="first_name"
                        className={`${
                          firstnameError
                            ? "border-red-500 "
                            : "border-gray-300 "
                        } block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder="Enter First Name"
                      />
                    </div>
                    {firstnameError && (
                      <span className="text-red-500">{firstnameError}</span>
                    )}
                  </div>

                  <div className="flex w-full flex-col">
                    <label
                      htmlFor="date_of_birth"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        {...register("lastName")}
                        type="text"
                        id="last_name"
                        className={`${
                          lastnameError ? "border-red-500 " : "border-gray-300 "
                        } block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder="Enter Last Name"
                      />
                    </div>
                    {lastnameError && (
                      <span className="text-red-500">{lastnameError}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4 ">
                    <div className=" ">
                      <label
                        htmlFor="date_of_birth"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Gender
                      </label>

                      <select
                        {...register("gender")}
                        defaultValue={""}
                        type="text"
                        id="gender"
                        className={`${
                          genderError ? "border-red-500 " : "border-gray-300 "
                        } block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    {genderError && (
                      <span className="text-red-500">{genderError}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4">
                    <label
                      htmlFor="date_of_birth"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Date of Birth
                    </label>

                    <div className="relative flex gap-2">
                      <select
                        {...register("month")}
                        id="month"
                        defaultValue={""}
                        required
                        className={`${
                          dateOfBirthError
                            ? "border-red-500"
                            : "border-gray-300"
                        } block pb-2 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`}
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>

                      <select
                        {...register("day")}
                        id="day"
                        className={`${
                          dateOfBirthError
                            ? "border-red-500"
                            : "border-gray-300"
                        } block pb-2 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`}
                      >
                        <option value="" disabled>
                          Day
                        </option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        {...register("year")}
                        id="year"
                        className={`${
                          dateOfBirthError
                            ? "border-red-500"
                            : "border-gray-300"
                        } block pb-2 pt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`}
                      >
                        <option value="" disabled>
                          Year
                        </option>
                        {Array.from({ length: 120 }, (_, i) => (
                          <option key={2024 - i} value={2024 - i}>
                            {2024 - i}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Error Display */}
                    {dateOfBirthError && (
                      <span className="text-red-500">{dateOfBirthError}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4 ">
                    <div className="relative ">
                      <label
                        htmlFor="date_of_birth"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Contact Number
                      </label>
                      <input
                        {...register("contactNumber")}
                        type="number"
                        id="contact_number"
                        className={`${
                          contactError ? "border-red-500 " : "border-gray-300 "
                        } block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder="Enter Contact Number"
                      />
                    </div>
                    {contactError && (
                      <span className="text-red-500">{contactError}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 relative">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <LocationInput
                    location={location}
                    customerAddressError={customerAddressError}
                    onLocationChange={handleLocationChange}
                  />
                  {customerAddressError && (
                    <span className="text-red-500 text-sm">
                      {customerAddressError}
                    </span>
                  )}
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4 ">
                    <div className="relative ">
                      <label
                        htmlFor="date_of_birth"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Patient Insurance Provider
                      </label>
                      <input
                        {...register("patient_insurance_provider")}
                        type="text"
                        id="patient_insurance_provider"
                        className={`${"border-gray-300 "} block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder="Enter Patient Insurance Provider"
                      />
                    </div>
                    {/* {contactError && (
                      <span className="text-red-500">{contactError}</span>
                    )} */}
                  </div>
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4 ">
                    <div className="relative ">
                      <label
                        htmlFor="date_of_birth"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Patient Insurance ID
                      </label>
                      <input
                        {...register("patient_insurance_id")}
                        type="text"
                        id="patient_insurance_id"
                        className={`${"border-gray-300 "} block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder="Enter Patient Insurance ID"
                      />
                    </div>
                    {/* {contactError && (
                      <span className="text-red-500">{contactError}</span>
                    )} */}
                  </div>
                </div>

                {/* <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4 ">
                    <div className="relative ">
                      <label
                        htmlFor="status"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Status
                      </label>
                      <select
                        {...register("status")}
                        onChange={(e) => setStatus(e.target.value)}
                        defaultValue={status}
                        type="text"
                        id="status"
                        className={`${
                          statusError ? "border-red-500 " : "border-gray-300 "
                        } block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      >
                        <option value="">Select status</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Discharged">Discharged</option>
                        <option value="Transferred">Transferred</option>
                      </select>
                    </div>
                    {statusError && (
                      <span className="text-red-500">{statusError}</span>
                    )}
                  </div>
                </div>
                 */}
                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow mt-4">
                    <div className="relative">
                      <label
                        htmlFor="status"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Status
                      </label>
                      <select
                        {...register("status")}
                        onChange={(e) => setStatus(e.target.value)}
                        defaultValue={status}
                        id="status"
                        className={`${
                          statusError ? "border-red-500 " : "border-gray-300 "
                        } block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      >
                        <option value="">Select status</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Discharged">Discharged</option>
                        <option value="Transferred">Transferred</option>
                      </select>
                    </div>
                    {statusError && (
                      <span className="text-red-500">{statusError}</span>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow mt-4">
                    <label
                      htmlFor="admissionReason"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Reason for Admission
                    </label>
                    <select
                      {...register("admissionReason")}
                      onChange={(e) => setAdmissionReason(e.target.value)}
                      id="admissionReason"
                      className={`${
                        reasonError ? "border-red-500" : "border-gray-300"
                      } block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`}
                    >
                      <option value="">Select reason</option>
                      <option value="Injury">Injury</option>
                      <option value="Surgery">Underwent Surgery</option>
                      <option value="Illness">Illness</option>
                      <option value="Routine Checkup">Routine Checkup</option>
                      <option value="Observation">Observation</option>
                      <option value="Fever">Fever</option>
                      <option value="Childbirth">Childbirth</option>
                      <option value="Infection">Infection</option>
                      <option value="Dehydration">Dehydration</option>
                      <option value="Fracture">Fracture</option>
                      <option value="Headache">Severe Headache</option>
                      <option value="Poisoning">Poisoning</option>
                      <option value="Heart Attack">Heart Attack</option>
                      <option value="Respiratory Issues">
                        Respiratory Issues
                      </option>
                      <option value="Allergy">Allergy</option>
                      <option value="Digestive Problem">
                        Digestive Problem
                      </option>
                      <option value="Others">Others</option>
                    </select>

                    {reasonError && (
                      <span className="text-red-500">{reasonError}</span>
                    )}
                  </div>
                </div>

                {/* Additional Form for Custom Reason */}
                {admissionReason === "Others" && (
                  <div className="flex flex-col flex-grow mt-4">
                    <label
                      htmlFor="customReason"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Specify Reason for Admission
                    </label>
                    <textarea
                      {...register("customReason")}
                      type="text"
                      id="customReason"
                      rows={3}
                      className={`${
                        customReasonError ? "border-red-500" : "border-gray-300"
                      } block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`}
                      placeholder="Enter admission reason"
                    />
                    {customReasonError && (
                      <span className="text-red-500">{customReasonError}</span>
                    )}
                  </div>
                )}

                <div className="flex flex-col mt-4">
                  <label
                    htmlFor="doctor"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Doctors
                  </label>
                  <div className="space-y-2">
                    {doctors?.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="flex items-center justify-between p-2 border-b border-gray-300 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("doctorId")}
                            id={`doctor-${doctor.id}`}
                            value={doctor.id}
                            checked={selectedDoctors.includes(doctor.id)}
                            onChange={() => handleDoctorSelection(doctor.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`doctor-${doctor.id}`}
                            className="text-sm font-medium text-gray-900"
                          >
                            Dr. {doctor.firstName} {doctor.middleInitial}.{" "}
                            {doctor.lastName} - {doctor.specialization} (
                            {doctor.availability_start_day} to{" "}
                            {doctor.availability_end_day})
                          </label>
                        </div>
                        {selectedDoctors.includes(doctor.id) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-5 mt-6 mx-5">
                  <button
                    type="button"
                    onClick={() => closeModal(false)}
                    className="
                    flex p-2.5 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700  text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading ? true : false}
                    type="submit"
                    className={`${
                      loading ? "cursor-not-allowed" : "cursor-pointer"
                    } w-fit   p-2.5 px-4 bg-primary hover:bg-primary_hover text-[#fff]  text-sm rounded-lg`}
                  >
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AddPatients.propTypes = {
  modal: PropTypes.func,
  closeModal: PropTypes.func,
  fetchUpdate: PropTypes.func,
};

export default AddPatients;
