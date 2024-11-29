import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/loginloader/LoginLoading";
import { useToast } from "../../hooks/useToast";
import { IoMdArrowRoundBack } from "react-icons/io";
import ForgotPasswordOTP from "../Verification/ForgotPasswordOTP";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";

const ForgotPassword = ({ closeModal }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    setEmailError("");
    setErrorMessage("");
    e.preventDefault();
    try {
      const data = {
        email: email,
      };

      const response = await api.post("/auth/forgot-password", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        setTimeout(() => {
          toast.success(response.data.message);
        }, 0);

        setLoading(false);
        setShowOTP(true);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          if (error.path === "email") {
            setEmailError(error.msg);
          }
        });
      }
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const closeOTP = () => {
    setShowOTP(false);
  };
  return (
    <>
      <div className="h-screen max-h-min items-center relative w-full flex flex-col bg-gray-50">
        <Navbar />
        {showOTP ? (
          <div className="h-full w-full flex items-center justify-center">
            <ForgotPasswordOTP
              showOTP={showOTP}
              closeOTP={closeOTP}
              closeModal={closeModal}
              email={email}
            />
          </div>
        ) : (
          <>
            <div className=" flex items-center justify-center  p-5  gap-6  md:px-16 w-full h-full">
              {isLoading && <LoginLoading />}
              <div className=" text-gray-800 bg-white rounded-xl shadow-lg ">
                <div className="p-6 py-8 space-y-4 text-sm text-[#221f1f]">
                  <div className="flex gap-5 rounded-t">
                    <Link to="/login" className="text-2xl font-bold">
                      <IoMdArrowRoundBack />
                    </Link>
                    <h1 className="md:text-2xl font-bold text-lg ">
                      Forgot Password?
                    </h1>
                  </div>
                  <h3 className="text-sm md:text-[16px] text-gray-700">
                    Please provide your email for password reset verification.
                  </h3>
                  <form onSubmit={handleLogin}>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <div className="flex relative">
                      <span className="absolute h-full inline-flex   items-center px-3 text-sm text-gray-900 ">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          // aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="email"
                        className={`rounded-lg pl-12 bg-gray-50 border  ${
                          emailError || errorMessage
                            ? "border-red-500 "
                            : "border-gray-300 "
                        } text-gray-900 focus:ring-blue-500 focus:border-blue-100 block flex-1 min-w-0 w-full text-sm p-2.5 `}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {emailError && (
                      <span className="text-red-500 text-sm">{emailError}</span>
                    )}
                    {errorMessage && (
                      <span className="text-red-500 text-sm">
                        {errorMessage}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading ? true : false}
                      className={` ${
                        isLoading ? "cursor-not-allowed" : "cursor-pointer"
                      } w-full  mt-6 p-2 bg-primary hover:bg-primary_hover text-[#fff] md:text-lg text-sm rounded-lg`}
                    >
                      Continue
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

ForgotPassword.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default ForgotPassword;
