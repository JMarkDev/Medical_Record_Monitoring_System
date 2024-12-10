import PropTypes from "prop-types";
import { useState } from "react";
import { useFormat } from "../../hooks/useFormatDate";
import { BsThreeDots } from "react-icons/bs";
import {
  // MdOutlineRestore,
  // MdOutlineExitToApp,
  // MdTransferWithinAStation,
  // MdPreview,
  MdEventNote,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import api from "../../api/axios";
import Loader from "../loader/loginloader/LoginLoading";
import SuccessModal from "../SuccessModal";
import { getUserData } from "../../services/authSlice";
import { useSelector } from "react-redux";
import rolesList from "../../constants/rolesList";

const ViewModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Full Name:</strong> {appointment.fullName}
          </p>
          <p>
            <strong>Contact:</strong> {appointment.contact_number}
          </p>
          <p>
            <strong>Email:</strong> {appointment.email}
          </p>
          <p>
            <strong>Purpose:</strong> {appointment.purpose}
          </p>
          <p>
            <strong>Date:</strong> {appointment.date}
          </p>
          <p>
            <strong>Time:</strong> {appointment.time}
          </p>
          <p>
            <strong>Status:</strong> {appointment.status}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.object,
};
const AppointmentTable = ({ appointmentList, getAppointments }) => {
  const { fullDateFormat, formatTime } = useFormat();
  const user = useSelector(getUserData);
  const [openAction, setOpenAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    setStatus(status);
    try {
      const response = await api.put(
        `/appointment/update-appointment-status/${id}`,
        { status }
      );
      console.log(response.data);
      if (response.data.status === "success") {
        setOpenModal(true);
        getAppointments();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleView = (id) => {
    const filteredAppointment = appointmentList.find(
      (appointment) => appointment.id === id
    );
    setSelectedAppointment(filteredAppointment);
    setIsViewModalOpen(true); // Open the view modal
  };

  return (
    <div className=" bg-gray-50 overflow-x-auto">
      <div className="flex items-center justify-center">
        {loading && <Loader />}
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">
                FULL NAME
              </div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">
                Contact
              </div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">Email</div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">
                Purpose
              </div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">Date</div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">Time</div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">Status</div>
            </th>
            <th scope="col" className="px-2 py-3 whitespace-nowrap">
              <div className="flex items-center  whitespace-nowrap">Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {appointmentList.map(
            ({
              fullName,
              contact_number,
              email,
              purpose,
              date,
              time,
              status,
              id,
            }) => (
              <tr
                key={id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                <td className="px-2 py-4 whitespace-nowrap text-nowrap">
                  {fullName}
                </td>
                <td className="py-3 px-2 text-gray-700 text-nowrap">
                  {contact_number}
                </td>
                <td className="py-3 px-2 text-gray-700 text-nowrap">{email}</td>
                <td className="py-3 px-2 text-gray-700 text-nowrap">
                  {purpose}
                </td>
                <td className="py-3 px-2 text-gray-700 text-nowrap">
                  {fullDateFormat(date)}
                </td>
                <td className="py-3 px-2 text-gray-700 text-nowrap">
                  {formatTime(time)}
                </td>
                <td
                  className={`px-2 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs`}
                >
                  <span
                    className={`py-2 px-2 text-sm rounded-lg ${
                      status === "Scheduled"
                        ? "text-blue-600 bg-blue-100"
                        : status === "Completed"
                        ? "text-green-600 bg-green-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className=" py-4 px-2 flex gap-3 justify-center items-center relative">
                  {user?.role === rolesList.admin ? (
                    <button
                      onClick={() => handleView(id)}
                      className="text-lg text-green-500 gap-2 flex items-center font-semibold hover:text-green-600 focus:outline-none"
                    >
                      <FaRegEye /> View
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          setOpenAction(id === openAction ? null : id);
                          e.stopPropagation();
                        }}
                        className="text-2xl text-gray-800 font-semibold hover:text-gray-600 focus:outline-none"
                      >
                        <BsThreeDots />
                      </button>
                      {openAction === id && (
                        <div
                          onMouseLeave={() => setOpenAction(null)}
                          className="z-50 absolute flex flex-col right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl dark:bg-gray-800 dark:text-white"
                        >
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => handleView(id)}
                              className="w-full flex items-center gap-2 py-2 px-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md shadow-sm hover:bg-blue-200 transition-all duration-200 ease-in-out dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                            >
                              <FaRegEye className="h-5 w-5 text-blue-600" />
                              <span className="truncate">View</span>
                            </button>
                          </div>
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(id, "Scheduled")
                              }
                              className="w-full flex items-center gap-2 py-2 px-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md shadow-sm hover:bg-blue-200 transition-all duration-200 ease-in-out dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                            >
                              <MdEventNote className="h-5 w-5 text-blue-600" />
                              <span className="truncate">Scheduled</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(id, "Completed")
                              }
                              className="w-full flex items-center gap-2 py-2 px-2 text-sm font-medium text-green-700 bg-green-100 rounded-md shadow-sm hover:bg-green-200 transition-all duration-200 ease-in-out dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                            >
                              <MdCheckCircle className="h-5 w-5 text-green-600" />
                              <span className="truncate">Completed</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(id, "Cancelled")
                              }
                              className="w-full flex items-center gap-2 py-2 px-2 text-sm font-medium text-red-700 bg-red-100 rounded-md shadow-sm hover:bg-red-200 transition-all duration-200 ease-in-out dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                            >
                              <MdCancel className="h-5 w-5 text-red-600" />
                              <span className="truncate">Canceled</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {openModal && (
        <SuccessModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          status={status}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};

AppointmentTable.propTypes = {
  appointmentList: PropTypes.array.isRequired,
  getAppointments: PropTypes.func,
};

export default AppointmentTable;
