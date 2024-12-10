import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import profile from "../assets/images/profile.png";
import Navbar from "../components/navbar/Navbar";
import api from "../api/axios";
import LoginLoading from "../components/loader/loginloader/LoginLoading";
import { useToast } from "../hooks/useToast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import rolesList from "../constants/rolesList";
import { fetchUser, getUserData } from "../services/authSlice";
import Cookies from "js-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(getUserData);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");
    e.preventDefault();
    try {
      const data = {
        email: email,
        password: password,
      };

      const response = await api.post("/auth/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        const accessToken = response.data?.accessToken;

        toast.success(response.data.message);
        const role = response.data.role;
        if (accessToken) {
          Cookies.set("accessToken", accessToken, { expires: 1 });
          dispatch(fetchUser());
          // Set the access token in the axios headers
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          let path = "";
          if (role === rolesList.admin) {
            path = "/admin-dashboard";
          } else if (role === rolesList.doctor) {
            path = "/doctor-dashboard";
          } else if (role === rolesList.nurse) {
            path = "/nurse-dashboard";
          }
          navigate(path);
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          if (error.path === "email") {
            setEmailError(error.msg);
          } else if (error.path === "password") {
            setPasswordError(error.msg);
          }
        });
      }
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="h-screen  relative w-full flex items-center flex-col bg-gray-50">
        <Navbar />

        <div className="bg-white  flex flex-col justify-center items-center mt-5 p-6 rounded shadow-lg sm:w-[450px] w-full mx-5">
          {isLoading && <LoginLoading />}

          <h1 className="text-3xl font-bold font-poppins text-primary ">
            Login{" "}
          </h1>

          <img
            src={profile}
            alt="profile pic"
            className="h-20 my-6 border-2 rounded-full"
          />
          <form onSubmit={handleLogin} className="flex flex-col w-full ">
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
                  aria-hidden="true"
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

            <label
              htmlFor="password"
              className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <div className="flex relative">
              <span className="absolute h-full inline-flex   items-center px-3 text-sm text-gray-900 ">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a4 4 0 00-4 4v4H5a3 3 0 00-3 3v5a3 3 0 003 3h10a3 3 0 003-3v-5a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zm-3 6V6a3 3 0 016 0v4H7zm3 4a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`rounded-lg pl-12 bg-gray-50 border  ${
                  passwordError || errorMessage
                    ? "border-red-500 "
                    : "border-gray-300 "
                } text-gray-900 focus:ring-blue-500 focus:border-blue-100 block flex-1 min-w-0 w-full text-sm p-2.5 `}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={handleShowPass}
                className="absolute right-0 text-lg m-3 text-gray-700"
              >
                {" "}
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            {passwordError && (
              <span className="text-red-500 text-sm">{passwordError}</span>
            )}
            {errorMessage && (
              <span className="text-red-500 text-sm">{errorMessage}</span>
            )}

            <div className="flex justify-end">
              <Link
                to={"/forgot-password"}
                className="text-end mt-2  text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading ? true : false}
              className={` ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              } text-lg mt-4 bg-primary py-1 px-3 rounded font-semibold font-poppins shadow-sm hover:bg-primary_hover`}
            >
              Login
            </button>
            <p className="mt-4 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to={"/register"}
                // onClick={openRegister}
                className="text-blue-700 font-semibold cursor-pointer"
              >
                Register
              </Link>
            </p>
            {/* )} */}
          </form>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Login;
