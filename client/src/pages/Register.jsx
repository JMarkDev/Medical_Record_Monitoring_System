import Profile from "../components/profile_image/Profile";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import rolesList from "../constants/rolesList";
import LocationInput from "../components/Location";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../services/authSlice";
import Loader from "../components/loader/loginloader/LoginLoading";
import VerifyOTP from "./Verification/VerifyOTP";
import { useSelector } from "react-redux";

const Register = () => {
  const [Toggle, setToggle] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const user = useSelector(getUserData);
  const [passwordError, setPasswordError] = useState("");
  // const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  // const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [verifyOTP, setVerifyOTP] = useState(false);
  // Error state for backend validation messages
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [middleInitialError, setMiddleInitialError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [customerAddressError, setCustomerAddressError] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [start_dayError, setAvailability_start_dayError] = useState("");
  const [end_dayError, setAvailability_end_dayError] = useState("");
  const [start_timeError, setAvailability_start_timeError] = useState("");
  const [end_timeError, setAvailability_end_timeError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const [location, setLocation] = useState("");

  const [confirmPasswordError, setConfirmpasswordError] = useState("");

  const handleLocationChange = (location) => {
    setLocation(location);
  };

  const onSubmit = async (data) => {
    setEmail(data.email);
    if (Toggle === "Doctor") {
      data.role = rolesList.doctor;
    } else if (Toggle === "Nurse") {
      data.role = rolesList.nurse;
      data.specialization = null;
      data.availability_start_day = null;
      data.availability_end_day = null;
      data.availability_start_time = null;
      data.availability_end_time = null;
    } else {
      toast.error("Please select Professional Designation");
      return;
    }
    setLoading(true);

    setFirstnameError("");
    setLastnameError("");
    setMiddleInitialError("");
    setEmailError("");
    setContactError("");
    setCustomerAddressError("");
    setPasswordError("");
    setConfirmpasswordError("");
    setSpecializationError("");
    setAvailability_start_dayError("");
    setAvailability_end_dayError("");
    setAvailability_start_timeError("");
    setAvailability_end_timeError("");

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("middleInitial", data.middleInitial);
      formData.append("email", data.email);
      formData.append("birthDate", data.birthDate);
      formData.append("contactNumber", data.contactNumber);
      formData.append("role", data.role);
      formData.append("address", location);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("image", data.image); // Append the file
      if (data.role === rolesList.doctor) {
        formData.append("specialization", data.specialization);
        formData.append("availability_start_day", data.availability_start_day);
        formData.append("availability_end_day", data.availability_end_day);
        formData.append(
          "availability_start_time",
          data.availability_start_time
        );
        formData.append("availability_end_time", data.availability_end_time);
      }

      const response = await api.post("/auth/register", formData);

      if (response.data.status === "success") {
        toast.success(response.data.message);
        // navigate("/verify-otp", { state: { email: data.email } });
        setVerifyOTP(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
      setLoading(false);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "firstName":
              setFirstnameError(error.msg);
              break;
            case "lastName":
              setLastnameError(error.msg);
              break;
            case "middleInitial":
              setMiddleInitialError(error.msg);
              break;
            case "email":
              setEmailError(error.msg);
              break;
            case "contactNumber":
              setContactError(error.msg);
              break;
            case "address":
              setCustomerAddressError(error.msg);
              break;
            case "password":
              setPasswordError(error.msg);
              break;
            case "confirmPassword":
              setConfirmpasswordError(error.msg);
              break;
            case "specialization":
              setSpecializationError(error.msg);
              break;
            case "availability_start_day":
              setAvailability_start_dayError(error.msg);
              break;
            case "availability_end_day":
              setAvailability_end_dayError(error.msg);
              break;
            case "availability_start_time":
              setAvailability_start_timeError(error.msg);
              break;
            case "availability_end_time":
              setAvailability_end_timeError(error.msg);
              break;
            default:
              console.log(error);
          }
        });
      }
      toast.error(error.response.data.message);
    }
  };

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  return (
    <>
      <div className=" max-h-min relative w-full flex items-center flex-col bg-gray-50">
        <Navbar />

        {verifyOTP ? (
          <VerifyOTP email={email} />
        ) : (
          <div className="bg-white   flex flex-col justify-center items-center my-5 py-4 px-6 rounded shadow-lg sm:w-[450px] w-full mx-5">
            <h1 className="text-3xl font-bold font-poppins text-primary py-2">
              Sign up your account
            </h1>
            {loading && <Loader />}
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
              encType="multipart/form-data"
              className="w-full lg:min-w-[650px] "
            >
              <div className="flex justify-center items-center">
                <Profile setValue={setValue} />
              </div>

              <div className="flex flex-col mt-5 w-full items-center">
                {/* Professional Label for role selection */}
                <label
                  htmlFor="role-selection"
                  className="mb-3 text-lg font-semibold text-gray-800"
                >
                  Choose Your Professional Designation:
                </label>

                {/* Toggle buttons for Nurse and Doctor */}
                <div
                  id="role-selection"
                  className="flex bg-gray-100 w-fit justify-between rounded-md shadow p-1"
                >
                  {/* Nurse Button */}
                  <button
                    type="button"
                    className={`${
                      Toggle === "Nurse"
                        ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary text-white"
                        : "py-2 px-8 text-lg font-poppins font-medium text-primary cursor-pointer rounded"
                    }`}
                    onClick={() => {
                      setToggle("Nurse");
                    }}
                  >
                    Nurse
                  </button>

                  {/* Doctor Button */}
                  <button
                    type="button"
                    className={`${
                      Toggle === "Doctor"
                        ? "py-2 px-8 text-lg font-poppins font-semibold cursor-pointer rounded bg-primary text-white"
                        : "py-2 px-8 text-lg font-poppins font-medium text-primary cursor-pointer rounded"
                    }`}
                    onClick={() => {
                      setToggle("Doctor");
                    }}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              <div className="flex  justify-between md:flex-row flex-col gap-4 mt-4">
                <div className="flex flex-col  w-full">
                  <div className="relative ">
                    <input
                      {...register("firstName")}
                      type="text"
                      id="first_name"
                      className={`${
                        firstnameError ? "border-red-500 " : "border-gray-300 "
                      } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="first_name"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      First Name
                    </label>
                  </div>
                  {firstnameError && (
                    <span className="text-red-500">{firstnameError}</span>
                  )}
                </div>

                <div className="flex  w-full flex-col">
                  <div className="relative">
                    <input
                      {...register("lastName")}
                      type="text"
                      id="last_name"
                      className={`${
                        lastnameError ? "border-red-500 " : "border-gray-300 "
                      } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="last_name"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Last Name
                    </label>
                  </div>
                  {lastnameError && (
                    <span className="text-red-500">{lastnameError}</span>
                  )}
                </div>
                <div className="flex  w-full flex-col">
                  <div className="relative">
                    <input
                      {...register("middleInitial")}
                      type="text"
                      id="middle_initial"
                      maxLength={1}
                      onKeyDown={(e) => {
                        // Prevent certain symbols
                        if (["-", "+", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        // Ensure only one character, and convert to uppercase
                        e.target.value = e.target.value
                          .slice(0, 1)
                          .toUpperCase();
                      }}
                      className={`${
                        middleInitialError
                          ? "border-red-500"
                          : "border-gray-300"
                      } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder=" "
                    />

                    <label
                      htmlFor="middle_initial"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Middle Initial
                    </label>
                  </div>
                  {middleInitialError && (
                    <span className="text-red-500">{middleInitialError}</span>
                  )}
                </div>
              </div>
              {Toggle === "Doctor" && (
                <>
                  <div className="flex mt-4 flex-col">
                    <div className="flex w-full flex-col">
                      <div className="relative">
                        <select
                          {...register("specialization")}
                          id="specialization"
                          className={`${
                            specializationError
                              ? "border-red-500"
                              : "border-gray-300"
                          } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Specialization
                          </option>
                          <option value="Cardiologist">
                            Cardiologist (Heart)
                          </option>
                          <option value="Hepatologist">
                            Hepatologist (Liver)
                          </option>
                          <option value="Pulmonologist">
                            Pulmonologist (Lungs)
                          </option>
                          <option value="Nephrologist">
                            Nephrologist (Kidneys)
                          </option>
                          <option value="Endocrinologist">
                            Endocrinologist (Diabetes, Hormones)
                          </option>
                          <option value="Gastroenterologist">
                            Gastroenterologist (Digestive System)
                          </option>
                          <option value="Oncologist">
                            Oncologist (Cancer)
                          </option>
                          <option value="Pediatrician">
                            Pediatrician (Children)
                          </option>
                          <option value="OB-GYN">
                            OB-GYN (Women’s Health)
                          </option>
                          <option value="General Practitioner">
                            General Practitioner
                          </option>
                          <option value="Family Medicine Specialist">
                            Family Medicine Specialist
                          </option>
                          <option value="Infectious Disease Specialist">
                            Infectious Disease Specialist
                          </option>
                          <option value="Internal Medicine Specialist">
                            Internal Medicine Specialist
                          </option>
                          <option value="Dermatologist">
                            Dermatologist (Skin)
                          </option>
                          <option value="Neurologist">
                            Neurologist (Brain, Nerves)
                          </option>
                          <option value="Orthopedic Surgeon">
                            Orthopedic Surgeon (Bones, Joints)
                          </option>
                          <option value="Ophthalmologist">
                            Ophthalmologist (Eyes)
                          </option>
                          <option value="ENT Specialist">
                            ENT Specialist (Ear, Nose, Throat)
                          </option>
                          <option value="Psychiatrist">
                            Psychiatrist (Mental Health)
                          </option>
                          <option value="Surgeon">General Surgeon</option>
                          <option value="Pathologist">
                            Pathologist (Diagnostics)
                          </option>
                        </select>
                        <label
                          htmlFor="specialization"
                          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                          Specialization
                        </label>
                      </div>
                      {specializationError && (
                        <span className="text-red-500">
                          {specializationError}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      {/* Day Selection */}
                      <div className="flex flex-row w-full items-center gap-5">
                        <div className="relative w-full">
                          <select
                            {...register("availability_start_day")}
                            id="availability_start_day"
                            className={`${
                              start_dayError
                                ? "border-red-500 "
                                : "border-gray-300 "
                            } block w-full pb-2 pt-4  text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                            value={watch("availability_start_day") || ""}
                            placeholder=" "
                          >
                            <option value="" disabled>
                              Select Start Day
                            </option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                          <label
                            htmlFor="availability_start_day"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            Availability Start Day
                          </label>
                          {start_dayError && (
                            <span className="text-red-500">
                              {start_dayError}
                            </span>
                          )}
                        </div>
                        to
                        <div className="relative w-full">
                          <select
                            {...register("availability_end_day")}
                            id="availability_end_day"
                            className={`${
                              end_dayError
                                ? "border-red-500 "
                                : "border-gray-300 "
                            } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                            placeholder=" "
                            value={watch("availability_end_day") || ""}
                          >
                            <option value="" disabled>
                              Select End Day
                            </option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                          <label
                            htmlFor="availability_end_day"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            End Availability Day
                          </label>
                          {end_dayError && (
                            <span className="text-red-500">{end_dayError}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 flex-col">
                    <div className="mt-4">
                      {/* Day Selection */}
                      <div className="flex flex-row w-full items-center gap-5">
                        <div className="relative w-full">
                          <input
                            {...register("availability_start_time")}
                            id="availability_start_time"
                            type="time"
                            className={`${
                              start_timeError
                                ? "border-red-500 "
                                : "border-gray-300 "
                            } block w-full pb-2 pt-4  text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                            placeholder=" "
                          />

                          <label
                            htmlFor="availability_start_time"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            Availability Start time
                          </label>
                          {start_timeError && (
                            <span className="text-red-500">
                              {start_timeError}
                            </span>
                          )}
                        </div>
                        to
                        <div className="relative w-full">
                          <input
                            {...register("availability_end_time")}
                            id="availability_end_time"
                            type="time"
                            className={`${
                              end_timeError
                                ? "border-red-500 "
                                : "border-gray-300 "
                            } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                            placeholder=" "
                          />

                          <label
                            htmlFor="availability_end_time"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                          >
                            End Availability Time
                          </label>
                          {end_timeError && (
                            <span className="text-red-500">
                              {end_timeError}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col">
                <div className="relative mt-4">
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    className={`${
                      emailError ? "border-red-500 " : "border-gray-300 "
                    } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Email Address
                  </label>
                </div>
                {emailError && (
                  <span className="text-red-500">{emailError}</span>
                )}
              </div>

              <div className="flex justify-between md:flex-row flex-col gap-5">
                <div className="flex flex-col flex-grow mt-4 ">
                  <div className="relative ">
                    <input
                      {...register("contactNumber")}
                      type="number"
                      id="contact_number"
                      maxLength={11}
                      onKeyDown={(e) => {
                        // Prevent non-numeric characters and certain symbols
                        if (["-", "e", "E", "+", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        // Limit input to 11 characters
                        if (e.target.value.length > 11) {
                          e.target.value = e.target.value.slice(0, 11);
                        }
                      }}
                      className={`${
                        contactError ? "border-red-500 " : "border-gray-300 "
                      }  block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="contact_number"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Contact Number
                    </label>
                  </div>
                  {contactError && (
                    <span className="text-red-500">{contactError}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 relative">
                {/* <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                    </label> */}
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

              <div className="flex flex-col">
                <div className="relative mt-4">
                  <input
                    {...register("password")}
                    // type="text"
                    type={showPass ? "text" : "password"}
                    id="password"
                    className={`${
                      passwordError ? "border-red-500 " : "border-gray-300 "
                    } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Password
                  </label>
                  <span
                    onClick={handleShowPass}
                    className="absolute right-0 top-0 m-4 text-lg text-gray-700"
                  >
                    {showPass ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                {passwordError && (
                  <span className="text-red-500">{passwordError}</span>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showPass ? "text" : "password"}
                    id="confirm_password"
                    className={`${
                      confirmPasswordError
                        ? "border-red-500 "
                        : "border-gray-300 "
                    } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="confirm_password"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Confirm Password
                  </label>
                  <span
                    onClick={handleShowPass}
                    className="absolute right-0 top-0 m-4 text-lg text-gray-700"
                  >
                    {showPass ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                {confirmPasswordError && (
                  <span className="text-red-500">{confirmPasswordError}</span>
                )}
              </div>
              <button
                disabled={loading ? true : false}
                type="submit"
                className={`${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                } w-full  mt-6 p-2 bg-primary hover:bg-primary_hover text-[#fff] md:text-lg text-sm rounded-lg`}
              >
                Register
              </button>
              <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-blue-700 font-semibold cursor-pointer"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
};

export default Register;
