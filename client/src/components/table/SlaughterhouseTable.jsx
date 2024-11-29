import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import ProfileModal from "../ProfileModal";
import api from "../../api/axios";
import userIcon from "../../assets/images/user (1).png";
import NoData from "../NoData";

const UserTable = ({ users }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <>
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
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    ADDRESS
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  <div className="flex items-center  whitespace-nowrap">
                    ACTIONS
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
                    address,
                  },
                  index
                ) => (
                  <tr
                    onClick={() => navigate(`/slaughterhouse-records/${id}`)}
                    key={index}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
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

                    <td className="px-4 py-4 whitespace-nowrap">
                      {contactNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{email}</td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {address}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      <Link
                        to={`/slaughterhouse-records/${id}`}
                        className="flex items-center gap-3 p-2 bg-green-500 hover:bg-green-700 rounded-lg text-white"
                      >
                        View Records
                      </Link>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UserTable;
