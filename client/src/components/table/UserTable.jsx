import { useState, useEffect } from "react";
import { FaEye, FaRegEdit, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ProfileModal from "../ProfileModal";
import api from "../../api/axios";
import userIcon from "../../assets/images/user (1).png";
import DeleteModal from "../DeleteModal";
import { useDispatch } from "react-redux";
import { deleteUser, approvedAccount } from "../../services/usersSlice";
import { toastUtils } from "../../hooks/useToast";
import UpdateUser from "../../pages/Admin/UserManagement/UpdateUser";
import NoData from "../NoData";
import statusList from "../../constants/statusList";
import { getStatus } from "../../utils/getStatus";
import Loading from "../loader/loginloader/LoginLoading";
import rolesList from "../../constants/rolesList";

const UserTable = ({ users, fetchUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (users.length > 0) {
      const isDoctor = users.some((user) => user.role === rolesList.doctor);
      setIsDoctor(isDoctor);

      const isAdmin = users.some((user) => user.role === rolesList.admin);
      setIsAdmin(isAdmin);
    }
  }, [users]);

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const openDeleteModal = ({ id, name }) => {
    setName(name);
    setSelectedUser(id);
    // setSelectedEsuCampus(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    // setSelectedEsuCampus(null);
  };

  const openEditModal = (id) => {
    setSelectedUser(id);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser({ id: selectedUser, toast: toastUtils() }));
    closeDeleteModal();
  };

  const handleApprove = ({ id, email }) => {
    setLoading(true);
    dispatch(approvedAccount({ id, email, toast: toastUtils() }))
      .unwrap()
      .then(() => {
        setLoading(false);
        if (fetchUpdate) {
          fetchUpdate();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      {" "}
      <div className="flex justify-center">{loading && <Loading />}</div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {users.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {/* <th scope="col" className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center  whitespace-nowrap">
                  OFFICE ID
                </div>
              </th> */}
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    IMAGE
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center  whitespace-nowrap">
                    FULL NAME
                  </div>
                </th>
                {isDoctor && (
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center  whitespace-nowrap">
                      SPECIALIZATION
                    </div>
                  </th>
                )}

                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    CONTACT NUMBER
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    EMAIL
                  </div>
                </th>
                {/* <th scope="col" className="px-4 py-3">
                  <div className="flex items-center text-ellipsis whitespace-nowrap">
                    ADDRESS
                  </div>
                </th> */}
                {!isAdmin && (
                  <th scope="col" className="px-4 py-3">
                    <div className="flex items-center  whitespace-nowrap">
                      STATUS
                    </div>
                  </th>
                )}

                <th scope="col" className="px-4 py-3 ">
                  <div className="flex items-center justify-center  whitespace-nowrap">
                    ACTION
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map(
                (
                  {
                    id,
                    firstName,
                    lastName,
                    middleInitial,
                    image,
                    contactNumber,
                    email,
                    // address,
                    status,
                    specialization,
                  },
                  index
                ) => (
                  <tr
                    onClick={() => navigate(`/user-details/${id}`)}
                    key={index}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    {/* <th
                    scope="row"
                    className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th> */}
                    <th
                      scope="row"
                      className=" font-medium text-gray-900 whitespace-nowrap dark:text-white "
                    >
                      <div className="flex items-center justify-center">
                        <img
                          onClick={() => openModal(image)}
                          src={`${
                            image ? `${api.defaults.baseURL}${image}` : userIcon
                          }`}
                          alt=""
                          className="h-10 w-10 rounded-full cursor-pointer"
                        />
                        {showModal && (
                          <ProfileModal
                            data={selectedImage}
                            modal={showModal}
                            closeModal={closeModal}
                          />
                        )}
                      </div>
                    </th>

                    <td className="px-4 py-4 whitespace-nowrap">{`${firstName} ${middleInitial}. ${lastName}`}</td>
                    {isDoctor && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        {specialization}
                      </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {contactNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{email}</td>
                    {/* <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {address}
                    </td> */}
                    {!isAdmin && (
                      <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        <span
                          className={`${
                            status === statusList.verified
                              ? "bg-[#f3e887]"
                              : "bg-green-400"
                          }  text-gray-700 p-2 px-4 rounded-lg`}
                        >
                          {status === statusList.verified
                            ? "pending"
                            : getStatus(status)}
                        </span>
                      </td>
                    )}

                    <td className="px-4 py-4 flex gap-3 justify-center items-center">
                      {!isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove({ id, email });
                          }}
                          className={`${
                            status === statusList.verified
                              ? "vissible"
                              : "invisible"
                          } p-2 text-lg bg-green-500 hover:bg-green-800 text-white rounded-lg`}
                        >
                          <FaCheckCircle className="h-5 w-5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user-details/${id}`);
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
                            name: `${firstName} ${middleInitial}. ${lastName}`,
                          });
                          e.stopPropagation();
                        }}
                        className="p-2 md:text-lg text-sm hover:bg-red-700 bg-red-500 text-white rounded-lg"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>

                      {}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {editModal && (
          <UpdateUser
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

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func,
};

export default UserTable;
