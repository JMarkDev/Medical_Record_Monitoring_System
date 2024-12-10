import { useEffect, useState } from "react";
import profileImg from "../assets/images/doctor_profile.png";
import Navbar from "../components/navbar/Navbar";
import { getDoctors, fetchApprovedDoctors } from "../services/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFormat } from "../hooks/useFormatDate";
// import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import api from "../api/axios";
// import Loader from "../components/loader/loginloader/LoginLoading";
import SuccessAppointment from "../components/SuccessAppointment";
import AppointmentModal from "./AppointmentModal";
import api from "../api/axios";

const Appointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { formatTime } = useFormat();
  const [modal, setModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const doctors = useSelector(getDoctors);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApprovedDoctors());
  }, [dispatch]);

  const handleDoctorSelection = (doctor) => {
    const filteredDoctor = doctors.find((doc) => doc.id === doctor);
    setSelectedDoctor(filteredDoctor);
    setModal(true);
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen relative w-full flex items-center flex-col bg-gray-50">
      <Navbar />
      <div className="bg-gray-50 mt-10 w-full md:px-20 px-5 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Book an Appointment
        </h1>
        <h1 className="my-5 text-xl text-gray-700 font-semibold">
          Select a Doctor
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
          {doctors?.map(
            ({
              firstName,
              lastName,
              middleInitial,
              availability_start_day,
              availability_start_time,
              availability_end_day,
              availability_end_time,
              id,
              specialization,
              image,
            }) => (
              <div
                key={id}
                className={`p-6 cursor-pointer bg-white rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition ${
                  selectedDoctor?.id === id ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleDoctorSelection(id)}
              >
                <img
                  src={image ? `${api.defaults.baseURL}${image}` : profileImg}
                  alt="profile"
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  {`${firstName} ${middleInitial}. ${lastName}`}
                </h2>
                <p className="text-gray-600">{specialization}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {`${availability_start_day} - ${availability_end_day}, ${formatTime(
                    availability_start_time
                  )} - ${formatTime(availability_end_time)}`}
                </p>
              </div>
            )
          )}
        </div>

        {/* {modal && (
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden={!modal}
            className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-5 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
          >
            <div className="relative w-full mt-20  max-w-xl  bg-white p-6 rounded-lg shadow-lg">
              <button
                onClick={() => {
                  setModal(false);
                  setSelectedDoctor(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>

              <div className="flex absolute left-1/2 top-1/2 items-center justify-center">
                {loading && <Loader />}
              </div>
              <div className="w-full ">
                <h3 className="text-xl  font-semibold text-gray-800">
                  Selected Doctor:{" "}
                  {`${selectedDoctor.firstName} ${selectedDoctor.middleInitial}. ${selectedDoctor.lastName}`}
                </h3>
                <p className="text-gray-600">{selectedDoctor.specialization}</p>
                <p className="text-sm text-gray-500">
                  {`${selectedDoctor.availability_start_day} - ${
                    selectedDoctor.availability_end_day
                  }, ${formatTime(
                    selectedDoctor.availability_start_time
                  )} - ${formatTime(selectedDoctor.availability_end_time)}`}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 w-full flex flex-col h-full gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("fullName", {
                      required: "Full Name is required.",
                      validate: (value) =>
                        value.trim() !== "" || "Full Name is required.",
                    })}
                    onBlur={(e) => validateField(e.target.value, "fullName")}
                    className={`w-full mt-2 p-3 border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }  rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="tel"
                    {...register("email", {
                      required: "Email address is required",
                      validate: (value) =>
                        value.trim() !== "" ||
                        "This field cannot be empty or contain only spaces.",
                    })}
                    onBlur={(e) => validateField(e.target.value, "email")}
                    className={`w-full mt-2 p-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }  rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="number"
                    {...register("contact_number", {
                      required: "Contact number is required",
                      validate: (value) =>
                        value.trim() !== "" ||
                        "This field cannot be empty or contain only spaces.",
                      maxLength: {
                        value: 12,
                        message: "Contact number cannot exceed 12 characters",
                      },
                    })}
                    onBlur={(e) =>
                      validateField(e.target.value, "contact_number")
                    }
                    className={`w-full mt-2 p-3 border ${
                      errors.contact_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }  rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600`}
                    placeholder="Enter your contact number"
                  />
                  {errors.contact_number && (
                    <p className="text-red-500 text-sm">
                      {errors.contact_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purpose of Visit
                  </label>
                  <select
                    {...register("purpose", {
                      required: "Purpose of visit is required.",
                    })}
                    className={`w-full mt-2 p-3 border ${
                      errors.purpose ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-0 ${
                      errors.purpose
                        ? "focus:border-red-500"
                        : "focus:border-blue-600"
                    }`}
                  >
                    <option value="">Select purpose</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Routine Check-up">Routine Check-up</option>
                    <option value="Prescription Refill">
                      Prescription Refill
                    </option>
                  </select>
                  {errors.purpose && (
                    <p className="text-red-500 text-sm">
                      {errors.purpose.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-5 w-full">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      {...register("appointmentDate", {
                        required: "Preferred date is required",
                      })}
                      className={`w-full mt-2 p-3 border ${
                        errors.appointmentDate
                          ? "border-red-500"
                          : "border-gray-300 "
                      } rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600`}
                    />
                    {errors.appointmentDate && (
                      <p className="text-red-500 text-sm">
                        {errors.appointmentDate.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      {...register("time", {
                        required: "Time is required",
                      })}
                      className={`w-full mt-2 p-3 border ${
                        errors.time ? "border-red-500" : "border-gray-300 "
                      } rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600`}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 ">
                  <button
                    type="button"
                    onClick={() => {
                      setModal(false);
                      setSelectedDoctor(null);
                    }} // Adjust the action as needed
                    className="p-2 px-4 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`p-2 px-4 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ${
                      loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {loading ? "Booking..." : "Confirm Appointment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )} */}
        {modal && (
          <AppointmentModal
            modal={modal}
            selectedDoctor={selectedDoctor}
            setModal={setModal}
            setSuccessModal={setSuccessModal}
            setSelectedDoctor={setSelectedDoctor}
          />
        )}
      </div>
      {successModal && (
        <SuccessAppointment
          openModal={successModal}
          closeSuccessModal={closeSuccessModal}
          doctor={`${selectedDoctor?.firstName} ${selectedDoctor?.middleInitial}. ${selectedDoctor?.lastName}`}
        />
      )}
    </div>
  );
};

export default Appointment;
