import PropTypes from "prop-types";
import "./otp.css";
import sentImage from "../../assets/images/send-email.jpg";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/loginloader/LoginLoading";
import { useToast } from "../../hooks/useToast";
import "react-toastify/dist/ReactToastify.css";
import UpdatePassword from "../Auth/UpdatePassword";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const ForgotPasswordOTP = ({ email, closeOTP }) => {
  const toast = useToast();
  const [countDown, setCountDown] = useState(0);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpdatePass, setShowUpdatePass] = useState(false);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      // Ensuring only digits are entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Automatically focus the next input if a digit is entered
      if (value && index < 3) {
        document.getElementById(`otp-input${index + 2}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    setLoading(true);
    e.preventDefault();

    const data = {
      email: email,
      otp: otp.join(""),
    };
    try {
      const response = await api.post("/auth/verify-otp-forgot", data, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setShowUpdatePass(true);
        // closeOTP();
        // closeModal(false);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/resend-otp", { email: email });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setCountDown(60);
        setLoading(false);
        setErrorMessage("");
        setOtp(new Array(4).fill(""));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => setCountDown(countDown - 1), 1000);
    }
  }, [countDown]);

  const disableSubmit = otp.includes("") || otp.length < 4;
  return (
    <>
      {loading && <LoginLoading />}

      {showUpdatePass ? (
        <UpdatePassword
          // closeModal={closeModal}
          email={email}
          closeOTP={closeOTP}
        />
      ) : (
        <form className="otp-Form shadow-lg" onSubmit={handleSubmit}>
          {/* <span className="mainHeading">Enter OTP</span> */}
          <div className="flex gap-5 w-full rounded-t">
            <Link to="/login" className="text-2xl font-bold">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="md:text-2xl font-bold text-lg ">Forgot Password?</h1>
          </div>
          <img src={sentImage} alt="" className="w-32" />

          <div className="inputContainer">
            {otp.map((digit, index) => (
              <input
                key={index}
                required
                maxLength="1"
                type="text"
                className="otp-input"
                id={`otp-input${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
              />
            ))}
          </div>
          {errorMessage && (
            <span className="text-red-600 text-sm">{errorMessage}</span>
          )}

          <button
            disabled={disableSubmit ? true : false}
            className={`bg-primary text-gray-700 w-full p-2 rounded-lg hover:bg-primary_hover ${
              disableSubmit ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            type="submit"
          >
            Verify
          </button>
          <p className="resendNote">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              className={`text-primary font-bold ${
                countDown > 0 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              type="button"
              disabled={countDown > 0}
            >
              {`${
                countDown > 0 ? `Resend code in ${countDown}s` : "Resend Code"
              }`}
            </button>
          </p>
        </form>
      )}
    </>
  );
};

ForgotPasswordOTP.propTypes = {
  email: PropTypes.string.isRequired,
  closeOTP: PropTypes.func.isRequired,
  // closeModal: PropTypes.func.isRequired,
};

export default ForgotPasswordOTP;
