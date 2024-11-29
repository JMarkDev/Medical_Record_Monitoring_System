import { useState, useRef } from "react";
import { FaFileDownload, FaEye, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteModal from "../DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { toastUtils } from "../../hooks/useToast";
import EditAnimal from "../../pages/SlaughterHouse/AnimalRecords/EditAnimal";
import NoData from "../NoData";
import { deleteAnimal, clearId } from "../../services/animalsSlice";
import { BsThreeDots } from "react-icons/bs";
import { MdPreview } from "react-icons/md";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import Receipt from "../Receipt";
import { fetchAnimalById, getAnimalById } from "../../services/animalsSlice";
import { getUserData } from "../../services/authSlice";
import rolesList from "../../constants/rolesList";

const AnimalTable = ({ animalsList, fetchUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const animal = useSelector(getAnimalById);
  const [deleteModal, setDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const contentRef = useRef(null);

  const openDeleteModal = ({ id, name }) => {
    setName(name);
    setSelectedAnimal(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedAnimal(null);
    dispatch(clearId());
  };

  const openEditModal = (id) => {
    setSelectedAnimal(id);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setSelectedAnimal(null);
    dispatch(clearId());
  };

  const handleDelete = () => {
    dispatch(deleteAnimal({ id: selectedAnimal, toast: toastUtils() }));
    fetchUpdate();
    closeDeleteModal();
  };

  const handleDownloadPDF = (id) => {
    dispatch(fetchAnimalById(id));

    if (animal !== null) {
      setTimeout(() => {
        download();
      }, 500);
    }
  };

  const download = () => {
    const element = contentRef.current;

    const options = {
      margin: 0.5,
      filename: "Receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Convert HTML content into PDF
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        toast.success("Receipt downloaded successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Sort animalsList by createdAt in descending order (most recent first)
  const sortedAnimalsList = animalsList
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {animalsList.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {/* <th className="px-4 py-3 text-nowrap">TRANSACTION ID</th> */}
                {user?.role === rolesList.supervisor && (
                  <th className="px-4 py-3 text-nowrap">Type</th>
                )}
                <th className="px-4 py-3 text-nowrap">Weight (Kg)</th>
                <th className="px-4 py-3 text-nowrap">Price Per (Kg)</th>
                <th className="px-4 py-3 text-nowrap">Customer name</th>
                <th className="px-4 py-3 text-nowrap">Phone</th>
                <th className="px-4 py-3 text-nowrap">Address</th>
                <th className="px-4 py-3 text-nowrap">Date</th>
                {/* <th className="px-4 py-3 text-nowrap"> Date</th> */}
                <th className="px-4 py-3 text-center text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAnimalsList.map(
                (
                  {
                    id,
                    type,
                    weight,
                    pricePerKg,
                    slaughterDate,
                    owner: { customerName, customerPhone, customerAddress },
                  },
                  index
                ) => (
                  <tr
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transaction/${id}`);
                    }}
                    key={id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    {user?.role === rolesList.supervisor && (
                      <td className="px-4 py-4 text-nowrap">{type}</td>
                    )}

                    <td className="px-4 py-4 text-nowrap">{weight}kg</td>
                    <td className="px-4 py-4 text-nowrap">₱ {pricePerKg}</td>
                    <td className="px-4 py-4 text-nowrap">{customerName}</td>
                    <td className="px-4 py-4 text-nowrap">{customerPhone}</td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {customerAddress}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {slaughterDate}
                    </td>
                    {/* {user?.role === rolesList.admin && (
                      <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        {slaughterDate}
                      </td>
                    )} */}

                    {/* <td className="px-4 py-4 text-nowrap">{slaughterDate}</td> */}
                    {user?.role === rolesList.admin ? (
                      <td className="px-4 py-4 flex gap-3 justify-center items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/transaction/${id}`);
                            console.log(id);
                          }}
                          className="p-2 text-lg bg-[#fca326] hover:bg-[#f58e40] text-white rounded-lg"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPDF(id);
                          }}
                          className="p-2 text-lg bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
                        >
                          <FaFileDownload className="h-5 w-5" />
                        </button>
                        {/* <button
                          onClick={(e) => {
                            openEditModal(id);
                            e.stopPropagation();
                          }}
                          className="p-2 md:text-lg text-sm bg-[#3577c2] hover:bg-[#2d4199] text-white rounded-lg"
                        >
                          <FaRegEdit className="h-5 w-5" />
                        </button> */}
                        {/* <button
                          onClick={(e) => {
                            openDeleteModal({
                              id,
                              name: `TRANSACTION ID ${id}`,
                            });
                            e.stopPropagation();
                          }}
                          className="p-2 md:text-lg text-sm hover:bg-red-700 bg-red-500 text-white rounded-lg"
                        >
                          <FaTrashAlt className="h-5 w-5" />
                        </button> */}
                      </td>
                    ) : (
                      <td className="px-6 py-4 flex gap-3 justify-center items-center relative">
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
                              className={`z-20 absolute flex flex-col right-[-25px]  bottom-2 w-48 py-2 mt-2 bg-white rounded-md shadow-2xl transform translate-y-full`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPDF(id);
                                }}
                                className="w-full flex text-gray-700 items-center gap-2 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                              >
                                <span>
                                  <FaFileDownload className="h-4 w-4" />
                                </span>
                                Download Receipt
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/transaction/${id}`);
                                  console.log(id);
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
                                    name: `TRANSACTION ID ${id}`,
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
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {Object.keys(animalsList).length !== 0 && (
          <div style={{ display: "none" }}>
            {" "}
            {/* Hidden offscreen */}
            <Receipt data={animal} contentRef={contentRef} />
          </div>
        )}
        {/* modal, closeModal, fetchUpdate, id */}
        {editModal && (
          <EditAnimal
            modal={editModal}
            closeModal={closeEditModal}
            id={selectedAnimal}
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

AnimalTable.propTypes = {
  animalsList: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func,
};

export default AnimalTable;
