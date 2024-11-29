import Profile from "../../../components/profile_image/Profile";
import PropTypes from "prop-types";
import api from "../../../api/axios";
import { useForm } from "react-hook-form";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import {
  fetchUserById,
  getFetchedUserById,
  clearUser,
} from "../../../services/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import ChangeEmail from "../../Shared/ChangeEmail";
import LocationInput from "../../../components/Location";

const UpdateUser = ({ modal, closeModal, id, fetchUpdate }) => {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const toast = useToast();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const updateUser = useSelector(getFetchedUserById);
  const [location, setLocation] = useState("");
  // Error state for backend validation messages
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [middleInitialError, setMiddleInitialError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmpasswordError] = useState("");
  const [changeEmail, setChangeEmail] = useState(false);
  const [customerAddressError, setCustomerAddressError] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
      return () => {
        dispatch(clearUser());
      };
    }
  }, [id, dispatch]);

  const handleLocationChange = (location) => {
    setLocation(location);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    setFirstnameError("");
    setLastnameError("");
    setMiddleInitialError("");
    setEmailError("");
    setContactError("");
    setPasswordError("");
    setConfirmpasswordError("");
    setCustomerAddressError("");

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("middleInitial", data.middleInitial);
      formData.append("email", updateUser.email);
      formData.append("contactNumber", data.contactNumber);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("image", data.image); // Append the file
      formData.append("address", location);

      const response = await api.put(
        `/users/update-user-data/id/${id}`,
        formData
      );
      if (response.data.status === "success") {
        toast.success(response.data.message);
        closeModal(false);
        setLoading(false);
        // setTimeout(() => {
        //   fetchUpdate();
        // }, 1000);
        fetchUpdate();
      }
    } catch (error) {
      console.log(error);
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

  const handleChangeEmail = () => {
    setChangeEmail(true);
  };

  useEffect(() => {
    if (updateUser) {
      setValue("image", updateUser.image);
      setValue("firstName", updateUser.firstName);
      setValue("lastName", updateUser.lastName);
      setValue("middleInitial", updateUser.middleInitial);
      setValue("email", updateUser.email);
      setValue("birthDate", updateUser.birthDate);
      setValue("contactNumber", updateUser.contactNumber);
      setValue("designation", updateUser.designation);
      setValue("address", updateUser.address);
      setLocation(updateUser.address);
    }
  }, [updateUser, setValue]);

  const handleUpdateEmail = () => {
    fetchUpdate();
  };

  return (
    <>
      {changeEmail ? (
        <ChangeEmail
          modal={changeEmail}
          closeModal={closeModal}
          id={id}
          handleUpdateEmail={handleUpdateEmail}
          // fetchUpdate={fetchUpdate}
        />
      ) : (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden={!modal}
          className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-20 font-normal"
        >
          {loading && <LoginLoading />}
          <div className="relative w-full max-w-2xl max-h-full py-5 ">
            <div className="relative text-gray-800 bg-white rounded-xl shadow-lg">
              <div className="flex items-center justify-center">
                <h1 className="md:text-2xl font-bold text-lg p-4">
                  Update Details
                </h1>
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
                  <div className="flex justify-center items-center">
                    <Profile setValue={setValue} image={updateUser?.image} />
                  </div>

                  <h1 className="mt-4 text-lg font-bold text-gray-700">
                    User Account
                  </h1>
                  <div className="flex justify-between md:flex-row flex-col gap-4 mt-4">
                    <div className="flex flex-col">
                      <div className="relative">
                        <input
                          {...register("firstName")}
                          type="text"
                          id="first_name"
                          className={`${
                            firstnameError
                              ? "border-red-500 "
                              : "border-gray-300 "
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

                    <div className="flex flex-col">
                      <div className="relative">
                        <input
                          {...register("lastName")}
                          type="text"
                          id="last_name"
                          className={`${
                            lastnameError
                              ? "border-red-500 "
                              : "border-gray-300 "
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
                    <div className="flex flex-col">
                      <div className="relative">
                        <input
                          {...register("middleInitial")}
                          type="text"
                          id="middle_initial"
                          className={`${
                            middleInitialError
                              ? "border-red-500 "
                              : "border-gray-300 "
                          } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
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
                        <span className="text-red-500">
                          {middleInitialError}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between md:flex-row flex-col gap-5">
                    <div className="flex flex-col flex-grow md:mt-4 ">
                      <div className="relative ">
                        <input
                          {...register("contactNumber")}
                          type="number"
                          id="contact_number"
                          className={`${
                            contactError
                              ? "border-red-500 "
                              : "border-gray-300 "
                          } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
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
                  <div className="flex flex-col">
                    <div className="relative mt-4">
                      <input
                        {...register("email")}
                        type="text"
                        id="email"
                        disabled={true}
                        className={`${
                          emailError ? "border-red-500 " : "border-gray-300 "
                        } block pb-2 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                      >
                        Email Address |{" "}
                        <span
                          onClick={() => handleChangeEmail()}
                          className="font-bold cursor-pointer text-[#1a9cb7]"
                        >
                          Change
                        </span>
                      </label>
                    </div>
                    {emailError && (
                      <span className="text-red-500">{emailError}</span>
                    )}
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
                      <span className="text-red-500">
                        {confirmPasswordError}
                      </span>
                    )}
                  </div>
                  <button
                    disabled={loading ? true : false}
                    type="submit"
                    className={`${
                      loading ? "cursor-not-allowed" : "cursor-pointer"
                    } w-full  mt-6 p-2 bg-main hover:bg-main_hover text-[#fff] md:text-lg text-sm rounded-lg`}
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {modal && ( */}

      {/* )} */}
    </>
  );
};

UpdateUser.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
  id: PropTypes.number,
  fetchUpdate: PropTypes.func,
};

export default UpdateUser;
