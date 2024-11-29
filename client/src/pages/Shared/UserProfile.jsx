import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser, getUserData } from "../../services/authSlice";
import Profile from "../../components/profile_image/Profile";
import api from "../../api/axios";
import { useToast } from "../../hooks/useToast";
import Loading from "../../components/loader/loginloader/LoginLoading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useForm } from "react-hook-form";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useSelector(getUserData);
  const { register, handleSubmit, setValue } = useForm();

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [sendOtp, setSendOtp] = useState(true);
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPass, setShowPass] = useState(false);
  const [edit, setEdit] = useState(true);

  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );

  const [data, setData] = useState({
    image: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    birthDate: "",
    email: "",
    role: "",
    contactNumber: "",
    address: "",
  });

  const id = userData?.id;

  useEffect(() => {
    if (userData) {
      setData(userData);
      setFullName(
        `${userData.firstName} ${userData.middleInitial}. ${userData.lastName}`
      );
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setValue("image", userData.image);
      setValue("firstName", userData.firstName);
      setValue("middleInitial", userData.middleInitial);
      setValue("lastName", userData.lastName);
      setValue("email", userData.email);
      setValue("contactNumber", userData.contactNumber);
      setValue("address", userData.address);
      if (userData.image) {
        setProfilePic(`${api.defaults.baseURL}${userData.image}`);
      }
    }
  }, [setValue, userData]);

  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("middleInitial", data.middleInitial);
    formData.append("email", data.email);
    formData.append("contactNumber", data.contactNumber);
    formData.append("address", data.address);
    formData.append("image", data.image); // Append the file

    try {
      const response = await api.put(
        `/users/update-profile/id/${id}`,
        formData
      );
      if (response.data.status === "success") {
        toast.success(response.data.message);
        dispatch(fetchUser());
        setLoader(false);
        setTimeout(() => {
          setEdit(true);
        }, 1000);
      }
    } catch (error) {
      console.log(error.response);
      // toast.error(error.response.data.message);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setLoader(true);
    try {
      const response = await api.post(`/users/update-email`, {
        email: newEmail,
      });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setSendOtp(!sendOtp);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    const values = {
      email: newEmail,
      otp: otp,
    };

    setLoader(true);

    try {
      const response = await api.put(
        `/users/update-email/verify-otp/${id}`,
        values
      );

      if (response.data.status === "success") {
        toast.success("Email updated successfully. Please login again.");
        Cookies.remove("accessToken");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const changePassword = async () => {
    setLoader(true);
    const data = {
      password: password,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const response = await api.put(`/users/update-password/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setActiveTab("profile");
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const showPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <>
      <div className="flex text-sm flex-col lg:flex-row w-full gap-5">
        <div className="flex flex-col gap-3 justify-center items-center p-4 bg-white border border-gray-300 shadow-lg min-w-[250px] h-fit rounded-lg">
          {loader && <Loading />}
          {edit ? (
            <img className="w-32 h-32 rounded-full" src={profilePic} alt="" />
          ) : (
            <Profile image={data.image} setValue={setValue} />
          )}

          <h1 className="font-bold text-lg text-gray-800 text-center">
            {fullName}
          </h1>
          <span className="text-gray-700 md:text-md text-sm ">
            {data?.email}
          </span>
        </div>
        <div className="flex  flex-col flex-grow sm:border md:border-gray-300 md:shadow-lg rounded-lg">
          <ul className="flex gap-2 md:border md:border-gray-300 w-full h-12 items-center md:p-4 ">
            <li
              className={`cursor-pointer  text-sm text-nowrap px-2 py-1 rounded-md ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile info
            </li>
            <li
              className={`cursor-pointer text-sm text-nowrap px-2 py-1 rounded-md ${
                activeTab === "update"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("update")}
            >
              Change email
            </li>
            <li
              className={`cursor-pointer  text-sm text-nowrap px-2 py-1 rounded-md  ${
                activeTab === "password"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change password
            </li>
          </ul>
          <div className="py-6  md:px-4 text-gray-600">
            {activeTab === "profile" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    First name
                  </label>
                  <input
                    {...register("firstName")}
                    disabled={edit ? true : false}
                    className="rounded-lg border bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Last name
                  </label>
                  <input
                    {...register("lastName")}
                    disabled={edit ? true : false}
                    className="rounded-lg border bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Middle initial
                  </label>
                  <input
                    {...register("middleInitial")}
                    disabled={edit ? true : false}
                    className="rounded-lg border bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                  />
                </div>

                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Contact number
                  </label>
                  <input
                    {...register("contactNumber")}
                    className="rounded-lg border  bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                    disabled={edit ? true : false}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    className="rounded-lg border cursor-not-allowed bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 w-1/4"
                  >
                    Address
                  </label>
                  <input
                    {...register("address")}
                    className="rounded-lg border  bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="text"
                    disabled={edit ? true : false}
                  />
                </div>

                <div className="flex  justify-end">
                  {edit ? (
                    <button
                      onClick={() => setEdit(!edit)}
                      type="button"
                      className="w-fit mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      type="button"
                      className="w-fit mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Save Profile
                    </button>
                  )}
                </div>
              </div>
            )}
            {activeTab === "update" && (
              <div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor=""
                      className="text-md font-semibold text-gray-700 w-1/4" // Adjust this width as needed
                    >
                      New email
                    </label>
                    <input
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={`rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm`}
                      type="text"
                      placeholder="Enter new email"
                    />
                  </div>

                  <div className="flex items-center relative gap-5">
                    <label
                      htmlFor=""
                      className="text-md font-semibold text-gray-700 w-1/4" // Adjust this width as needed
                    >
                      OTP
                    </label>
                    <input
                      onChange={(e) => setOTP(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                      type="text"
                      placeholder="Enter 4 digits OTP"
                    />
                  </div>

                  <div className="flex justify-end">
                    {/* <button
                      onClick={handleSendOTP}
                      type="button"
                      className="text-[#1A9CE7] text-sm absolute right-5"
                    >
                      SEND
                    </button> */}
                    {sendOtp ? (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2 cursor-pointer"
                      >
                        Send code
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleChangeUsername}
                        className=" w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                      >
                        Verify code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4 font-semibold text-gray-700"
                  >
                    Old password
                  </label>
                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter old password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4 font-semibold text-gray-700"
                  >
                    New password
                  </label>
                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter new password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4  font-semibold text-gray-700"
                  >
                    Confirm password
                  </label>

                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter new password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => changePassword()}
                    className="w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg p-2"
                  >
                    Change password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
