import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, getUserData, getLoading } from "../../services/authSlice";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import Logo from "../../assets/images/logo.png";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import Notification from "../Notification";
import NavProfile from "../NavProfile";
import userIcon from "../../assets/images/user (1).png";
import api from "../../api/axios";
import {
  fetchNotificationById,
  getNotificationById,
  readNotification,
} from "../../services/notificationSlice";
import io from "socket.io-client";

const socket = io.connect(`${api.defaults.baseURL}`);

const Navbar = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  const loading = useSelector(getLoading);
  const location = useLocation(); // Get current path

  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(userIcon);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle
  const getNotification = useSelector(getNotificationById);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (userData && userData.image) {
      setProfilePic(`${api.defaults.baseURL}${userData.image}`);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      dispatch(fetchNotificationById(userData.id));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (userData) {
      const handleUploadSuccess = () => {
        dispatch(fetchNotificationById(userData.id));
      };

      const handleReceivedSuccess = () => {
        dispatch(fetchNotificationById(userData.id));
      };

      socket.on("success_upload", handleUploadSuccess);
      socket.on("success_received", handleReceivedSuccess);
    }

    return () => {
      socket.off("success_upload");
      socket.off("success_received");
      socket.disconnect();
    };
  }, [dispatch, userData]);

  useEffect(() => {
    if (getNotification) {
      setNotifications(getNotification);
      const unread = getNotification?.filter(
        (notification) => notification.is_read === 0
      );
      setUnread(unread.length);
    }
  }, [getNotification]);

  const handleNotification = () => {
    setShowNotification(!showNotification);
    setShowProfile(false);
  };

  const handleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotification(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Helper function to apply border-bottom for active links
  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="py-2 w-full flex items-center px-5 bg-white shadow-lg">
      <div className="flex justify-between w-full items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-lg font-semibold bg-green-400 bg-clip-text text-transparent drop-shadow-md">
              HealthCare Medical Record
            </h1>
            <h2 className="text-xs font-medium text-gray-700 drop-shadow-sm">
              System
            </h2>
          </div>
        </div>

        {!userData ? (
          <div className="lg:hidden">
            {menuOpen ? (
              <HiX
                className="text-3xl text-gray-700 cursor-pointer"
                onClick={toggleMenu}
              />
            ) : (
              <HiOutlineMenuAlt3
                className="text-3xl text-gray-700 cursor-pointer"
                onClick={toggleMenu}
              />
            )}
          </div>
        ) : (
          <div className="lg:hidden block">
            <div className="relative  flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative ">
                {unread > 0 && (
                  <span
                    onClick={handleNotification}
                    className="absolute cursor-pointer right-0 top-[-6px] text-white bg-red-600 rounded-full px-1.5 text-sm"
                  >
                    {unread}
                  </span>
                )}
                <IoMdNotificationsOutline
                  className="text-3xl text-gray-700 cursor-pointer"
                  onClick={handleNotification}
                />
                {showNotification && (
                  <div
                    onMouseLeave={handleNotification}
                    className="absolute z-50 right-5"
                  >
                    <Notification
                      notifications={notifications}
                      // handleNotificationClick={handleNotificationClick}
                    />
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <img
                src={profilePic}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={handleProfile}
              />
              {/* {showProfile && <NavProfile />} */}
              {showProfile && (
                <div
                  onMouseLeave={handleNotification}
                  className="absolute z-50 top-9 right-5"
                >
                  <NavProfile />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <ul
          className={`absolute lg:relative lg:flex lg:items-center lg:space-x-6 ${
            menuOpen
              ? "top-16 items-center left-0 w-full bg-white shadow-md flex flex-col p-5 space-y-4 z-50"
              : "hidden lg:flex"
          }`}
        >
          {loading ? (
            <p>Loading...</p>
          ) : userData ? (
            <>
              <div className="relative">
                {unread > 0 && (
                  <span
                    onClick={handleNotification}
                    className="absolute right-0 top-[-6px] text-white bg-red-600 rounded-full px-1.5 text-sm"
                  >
                    {unread}
                  </span>
                )}
                <IoMdNotificationsOutline
                  className="text-3xl text-gray-700 cursor-pointer"
                  onClick={handleNotification}
                />
                {showNotification && (
                  <div
                    onMouseLeave={handleNotification}
                    className="absolute z-50 right-5"
                  >
                    <Notification
                      notifications={notifications}
                      // handleNotificationClick={handleNotificationClick}
                    />
                  </div>
                )}
              </div>
              <span className="font-bold text-gray-700">
                {userData?.firstName}
              </span>
              <img
                src={profilePic}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={handleProfile}
              />
              {/* {showProfile && <NavProfile />} */}
              {showProfile && (
                <div
                  onMouseLeave={handleNotification}
                  className="absolute z-50 top-9 right-5"
                >
                  <NavProfile />
                </div>
              )}
            </>
          ) : (
            <>
              <li>
                <Link
                  to={"/home"}
                  className={`relative w-fit h-10 p-2 text-gray-700 focus:outline-none group ${
                    isActiveLink("/home") ? "border-b-2 border-primary" : ""
                  }`}
                >
                  Home
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li>
                <Link
                  to={"/login"}
                  className={`relative w-fit h-10 p-2 text-gray-700 focus:outline-none group ${
                    isActiveLink("/login") ? "border-b-2 border-primary" : ""
                  }`}
                >
                  Login
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/register"}
                  className={`relative w-fit h-10 p-2 text-gray-700 focus:outline-none group ${
                    isActiveLink("/register") ? "border-b-2 border-primary" : ""
                  }`}
                >
                  Register
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              {/* <li>
                <Link
                  to={"/appointment"}
                  className="p-2.5 bg-primary hover:bg-primary_hover transition-all duration-300 text-white rounded-lg"
                >
                  Book Appointment
                </Link>
              </li> */}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
