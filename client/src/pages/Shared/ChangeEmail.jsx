import PropTypes from "prop-types";
import api from "../../api/axios";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import LoginLoading from "../../components/loader/loginloader/LoginLoading";
// import { fetchOffice } from "../../services/usersSlice";
// import { useDispatch } from "react-redux";

const ChangeEmail = ({ modal, closeModal, id, handleUpdateEmail }) => {
  // const dispatch = useDispatch();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setOtpError("");

    setLoader(true);
    try {
      const response = await api.post(`/users/update-email`, { email });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setLoader(false);
        handleUpdateEmail();
      }
    } catch (error) {
      setLoader(false);
      setEmailError(error.response.data.message);
      // toast.error(error.response.data.message);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    const values = {
      email: email,
      otp: otp,
    };

    setLoader(true);
    setEmailError("");
    setOtpError("");

    try {
      const response = await api.put(
        `/users/update-email/verify-otp/${id}`,
        values
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        // dispatch(fetchOffice());
      }
      setTimeout(() => {
        closeModal(false);
      }, 1000);
      handleUpdateEmail();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setOtpError(error.response.data.message);
      if (error.response.data.status === "error") {
        setOtpError(error.response.data.message);
      } else if (error.response.data.errors) {
        setEmailError(error.response.data.errors[0].msg);
      }
      console.log(error);
    }
  };

  const submitDisable = !(email && otp);
  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden={!modal}
        onClick={() => closeModal(false)}
        className="fixed inset-0 z-[40] px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-20 font-normal"
      >
        {" "}
        {loader && <LoginLoading />}
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <div className="relative text-gray-800 bg-white rounded-xl shadow-lg ">
            <div className="flex items-center justify-center rounded-t">
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
            <div className="max-w-2xl m-auto sm:mx-auto sm:w-full sm:max-w-lg px-6 py-10 overflow-hidden bg-white p-4 rounded-lg shadow-md">
              <div className="flex"></div>
              <h1 className="test-center text-2xl font-semibold mb-4">
                Enter New Email
              </h1>
              <h3 className="text-gray-600 mb-6">
                Please enter your New Email. We will send you a one time code
              </h3>

              {/* <form  > */}
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  name="email"
                  type="text"
                  placeholder="enter new email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full border-gray-400 text-sm border py-2 px-2 text-gray-900 bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    emailError ? "border-red-600" : "" // Apply border-red-600 class when there's an error
                  }`}
                />
              </div>
              {emailError && (
                <div className="text-red-600 text-sm">{emailError}</div>
              )}
              <div className="mt-4">
                <label className="block text-gray-700">OTP</label>
                <div className="flex relative items-center">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="4"
                    name="otp"
                    placeholder="4 digits"
                    className={`block w-full rounded-lg border border-gray-400 py-2 px-2 text-gray-900 bg-transparent shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                      otpError ? "border-red-600" : "" // Apply border-red-600 class when there's an error
                    }`}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="text-[#1A9CE7] text-sm absolute right-5"
                  >
                    SEND
                  </button>
                </div>
              </div>
              {/* error message */}
              {otpError && (
                <div className="text-red-600 text-sm">{otpError}</div>
              )}
              <button
                className={`w-full bg-main text-white px-4 py-2 mt-8 rounded-md hover:bg-main focus:outline-none focus:bg-main
            ${submitDisable ? "opacity-50 cursor-not-allowed" : ""}
            `}
                disabled={submitDisable}
                onClick={handleChangeUsername}
              >
                Verify Code
              </button>
              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ChangeEmail.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
  id: PropTypes.number,
  handleUpdateEmail: PropTypes.func,
  fetchUpdate: PropTypes.func,
};

export default ChangeEmail;
