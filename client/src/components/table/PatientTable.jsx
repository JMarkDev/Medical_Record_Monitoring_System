import { useState } from "react";
import { FaEye, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteModal from "../DeleteModal";
import { useDispatch } from "react-redux";
import {
  MdOutlineExitToApp,
  MdTransferWithinAStation,
  MdOutlineRestore,
} from "react-icons/md";
import {
  deletePatient,
  updatePatientStatus,
} from "../../services/patientSlice";
import { toastUtils } from "../../hooks/useToast";
import UpdatePatient from "../../pages/Admin/PatientRecords/UpdatePatient";
import NoData from "../NoData";
import { MdPreview } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

const PatientTable = ({ patients, fetchUpdate, patientStatus }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAction, setOpenAction] = useState(false);

  const openDeleteModal = ({ id, name }) => {
    setName(name);
    setSelectedUser(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedUser(null);
  };

  const openEditModal = (id) => {
    setSelectedUser(id);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const handleDelete = () => {
    dispatch(deletePatient({ id: selectedUser, toast: toastUtils() }));
    closeDeleteModal();
  };

  const handleUpdateStatus = ({ id, status }) => {
    dispatch(
      updatePatientStatus({ id: id, status: status, toast: toastUtils() })
    );
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {patients?.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center  whitespace-nowrap">
                    FULL NAME
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    CONTACT NUMBER
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    ADDRESS
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    DATE OF BIRTH
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    GENDER
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    STATUS
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 ">
                  <div className="flex items-center justify-center  whitespace-nowrap">
                    ACTION
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {patients?.map(
                (
                  {
                    id,
                    firstName,
                    lastName,
                    contactNumber,
                    address,
                    dateOfBirth,
                    gender,
                    status,
                  },
                  index
                ) => (
                  <tr
                    onClick={() => navigate(`/patient-details/${id}`)}
                    key={index}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    {/* <th
                    scope="row"
                    className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th> */}
                    <td className="px-4 py-4 whitespace-nowrap">{`${firstName} ${lastName}`}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {contactNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {dateOfBirth}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {gender}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs`}
                    >
                      <span
                        className={`p-2 rounded-lg text-white ${
                          status === "Admitted"
                            ? "bg-green-400"
                            : status === "Transferred"
                            ? "bg-yellow-400"
                            : "bg-blue-400"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    {/* <td className="px-4 py-4 flex gap-3 justify-center items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patient-details/${id}`);
                        }}
                        className=" p-2 text-lg bg-[#fca326] hover:bg-[#f58e40] text-white rounded-lg"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>

                      <button
                        onClick={(e) => {
                          openEditModal(id);
                          e.stopPropagation();
                        }}
                        className="p-2 md:text-lg text-sm  bg-[#3577c2] hover:bg-[#2d4199] text-white rounded-lg"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>

                      <button
                        onClick={(e) => {
                          openDeleteModal({
                            id,
                            name: `${firstName} ${lastName}`,
                          });
                          e.stopPropagation();
                        }}
                        className="p-2 md:text-lg text-sm hover:bg-red-700 bg-red-500 text-white rounded-lg"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>

                      {}
                    </td> */}
                    {/* <td className="px-6 py-4 flex gap-3 justify-center items-center relative">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            setOpenAction(id === openAction ? null : id);
                            e.stopPropagation();
                          }}
                          className="text-2xl text-gray-800 font-semibold"
                        >
                          <BsThreeDots />
                        </button>
                        {openAction === id && (
                          <div
                            onMouseLeave={() => setOpenAction(null)}
                            className={`z-50 absolute flex flex-col right-[-25px]  bottom-2  w-48 py-2 mt-2 bg-white  rounded-md shadow-2xl transform translate-y-full`}
                          >
                            <div className="space-y-2">
          
                              <button className="w-full flex items-center gap-2 py-2 px-4 text-sm font-medium text-green-700 bg-green-100 rounded-md shadow-sm hover:bg-green-200 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700">
                                <MdLocalHospital className="h-5 w-5" />
                                <span>Admitted</span>
                              </button>

                              <button className="w-full flex items-center gap-2 py-2 px-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-md shadow-sm hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700">
                                <MdOutlineExitToApp className="h-5 w-5" />
                                <span>Discharged</span>
                              </button>

                             
                              <button className="w-full flex items-center gap-2 py-2 px-4 text-sm font-medium text-orange-700 bg-orange-100 rounded-md shadow-sm hover:bg-orange-200 dark:bg-gray-800 dark:text-orange-400 dark:hover:bg-gray-700">
                                <MdTransferWithinAStation className="h-5 w-5" />
                                <span>Transferred</span>
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/patient-details/${id}`);
                              }}
                              className="w-full flex text-green-700 items-center gap-2 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              <span>
                                <MdPreview className="h-4 w-4" />
                              </span>
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                openEditModal(id);
                                e.stopPropagation();
                              }}
                              className="w-full flex items-center gap-2 text-blue-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              <span>
                                <FaRegEdit className="h-4 w-4" />
                              </span>
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                openDeleteModal({
                                  id,
                                  name: `${firstName} ${lastName}`,
                                });
                                e.stopPropagation();
                              }}
                              className="w-full flex items-center gap-2 text-red-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              <span>
                                <FaTrashAlt className="h-4 w-4" />
                              </span>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td> */}

                    <td className="px-6 py-4 flex gap-3 justify-center items-center relative">
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
                              {patientStatus === "Archived" ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    handleUpdateStatus({
                                      id: id, // Pass the correct `selectedUser` here
                                      status: "Admitted",
                                    });
                                    e.stopPropagation();
                                  }}
                                  className="w-full flex items-center gap-2 py-2 px-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-md shadow-sm hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                                >
                                  <MdOutlineRestore className="h-5 w-5" />
                                  <span>Restore</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      handleUpdateStatus({
                                        id: id, // Pass the correct `selectedUser` here
                                        status: "Discharged",
                                      });
                                      e.stopPropagation();
                                    }}
                                    className="w-full flex items-center gap-2 py-2 px-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-md shadow-sm hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                                  >
                                    <MdOutlineExitToApp className="h-5 w-5" />
                                    <span>Discharged</span>
                                  </button>
                                  {/* 
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      handleUpdateStatus({
                                        id: id, // Pass the correct `selectedUser` here
                                        status: "Transferred",
                                      });
                                      e.stopPropagation();
                                    }}
                                    className="w-full flex items-center gap-2 py-2 px-4 text-sm font-medium text-orange-700 bg-orange-100 rounded-md shadow-sm hover:bg-orange-200 dark:bg-gray-800 dark:text-orange-400 dark:hover:bg-gray-700"
                                  >
                                    <MdTransferWithinAStation className="h-5 w-5" />
                                    <span>Transferred</span>
                                  </button> */}
                                </>
                              )}
                            </div>
                            {/* View Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/patient-details/${id}`);
                              }}
                              className="w-full flex items-center gap-2 py-2 px-4 text-left text-gray-800 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <MdPreview className="h-4 w-4" />
                              View
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={(e) => {
                                openEditModal(id);
                                e.stopPropagation();
                              }}
                              className="w-full flex items-center gap-2 py-2 px-4 text-left text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700"
                            >
                              <FaRegEdit className="h-4 w-4" />
                              Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                openDeleteModal({
                                  id,
                                  name: `${firstName} ${lastName}`,
                                });
                                e.stopPropagation();
                              }}
                              className="w-full flex items-center gap-2 py-2 px-4 text-left text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700"
                            >
                              <FaTrashAlt className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {editModal && (
          <UpdatePatient
            modal={editModal}
            closeModal={closeEditModal}
            id={selectedUser}
            fetchUpdate={fetchUpdate}
          />
        )}

        {deleteModal && (
          <DeleteModal
            title={name}
            deleteModal={deleteModal}
            closeDeleteModal={closeDeleteModal}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

PatientTable.propTypes = {
  patients: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func,
  patientStatus: PropTypes.string,
};

export default PatientTable;
