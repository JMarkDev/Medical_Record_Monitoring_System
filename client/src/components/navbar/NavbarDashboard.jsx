import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserData } from "../../services/authSlice";
import userIcon from "../../assets/images/user (1).png";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaBars } from "react-icons/fa6";
import PropTypes from "prop-types";
import NavProfile from "../NavProfile";
import Notification from "../Notification";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  getNotificationById,
  fetchNotificationById,
  readNotification,
} from "../../services/notificationSlice";
import { getUserRole } from "../../utils/userRoles";
import io from "socket.io-client";
const socket = io.connect(`${api.defaults.baseURL}`);

const NavDashboard = ({ handleBurger }) => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  // const { userData } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [profilePic, setProfilePic] = useState(userIcon);
  const [notifications, setNotifications] = useState([]);
  const getNotification = useSelector(getNotificationById);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (userData && userData.image) {
      setProfilePic(`${api.defaults.baseURL}${userData.image}`);
    }
  }, [userData]);

  const pageTitles = {
    "/admin-dashboard": "Admin Dashboard",
    "/dashboard": "Dashboard",
    "/user-management": "User Management",
    "/user-profile": "User Profile",
    "/reports": "Reports",
    "/patient-records": "Patient Records",
    "/nurse": "Nurse List",
    "/doctor": "Doctor List",
    "/admin": "Admin List",
    "/user-details": "User Details",
  };

  const handleNotification = () => {
    setShowNotification(!showNotification);
    setShowProfile(false);
  };

  const handleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotification(false);
  };
  const location = useLocation();
  const pathname = location.pathname;
  const matchedKey = Object.keys(pageTitles).find((key) =>
    pathname.includes(key)
  );
  const title = pageTitles[matchedKey];

  useEffect(() => {
    if (userData) {
      dispatch(fetchNotificationById(userData.id));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (userData) {
      const handleSuccessAdd = () => {
        dispatch(fetchNotificationById(userData.id))
          .unwrap()
          .then((newNotifications) => {
            setNotifications(newNotifications);
          });
      };

      socket.on("success_add", handleSuccessAdd);
      socket.on("success_notification", handleSuccessAdd);
    }

    // Clean up the socket connection and remove the event listener
    return () => {
      socket.off("success_add");
      socket.off("success_notification");
      // socket.disconnect();
    };
  }, [dispatch, userData]);

  useEffect(() => {
    if (getNotification) {
      setNotifications(getNotification);
      const unread = getNotification.filter(
        (notification) => notification.is_read === 0
      );
      setUnread(unread.length);
    }
  }, [getNotification]);

  const handleNotificationClick = (id) => {
    dispatch(readNotification(id));
    setTimeout(() => {
      dispatch(fetchNotificationById(userData.id));
    }, 1000);
  };
  return (
    <div className="w-full z-20 md:w-[calc(100vw-16rem)] flex gap-5 items-center px-4 flex-grow fixed h-16 bg-white shadow-lg">
      <button
        onClick={handleBurger}
        aria-controls="logo-sidebar"
        type="button"
        className=" inline-flex items-center md:hidden text-2xl font-bold text-green-800 rounded-lg    "
      >
        <FaBars />
      </button>
      <div className="flex  justify-between items-center w-full">
        <h1 className="md:text-2xl text-lg font-bold text-main">{title}</h1>
        <div className="flex lg:text-[16px] text-sm gap-4">
          <div className="relative  flex items-center">
            {unread > 0 && (
              <span className="text-sm  px-1.5 absolute right-[-10px] top-0 text-white bg-red-600 rounded-full text-center">
                {unread}
              </span>
            )}

            <button
              onClick={handleNotification}
              onMouseEnter={handleNotification}
              className="flex items-center "
            >
              <IoMdNotificationsOutline className="text-2xl text-gray-900" />
              {/* <span className="hidden lg:block">Notifications</span> */}
            </button>
          </div>
          {showNotification && (
            <div
              onMouseLeave={handleNotification}
              className="absolute top-12 right-5 "
            >
              <Notification
                notifications={notifications}
                handleNotificationClick={handleNotificationClick}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-col flex text-gray-900">
              <span className="font-bold">{userData?.firstName}</span>
              <span className="text-[12px]">{getUserRole(userData?.role)}</span>
            </div>

            <img
              src={profilePic}
              onClick={handleProfile}
              onMouseEnter={handleProfile}
              alt=""
              className="h-10 w-10 rounded-full cursor-pointer bg-gray-100"
            />
            {showProfile && (
              <div
                onMouseLeave={handleProfile}
                className="absolute top-12 right-5 text-sm"
              >
                <NavProfile />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NavDashboard.propTypes = {
  handleBurger: PropTypes.func,
};

export default NavDashboard;
