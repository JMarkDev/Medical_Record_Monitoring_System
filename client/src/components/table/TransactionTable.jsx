import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  FaFileDownload,
  FaEye,
  FaRegEdit,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../api/axios";
import { IoMdPrint } from "react-icons/io";
// import { AiOutlineFileDone } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BsThreeDots } from "react-icons/bs";
import { MdPreview } from "react-icons/md";
import DeleteModal from "../DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteAnimal, updateTransaction } from "../../services/animalsSlice";
import { toastUtils } from "../../hooks/useToast";
import NoData from "../NoData";
import { getBgColor } from "../../utils/animalBgStatus";
import { useFormat } from "../../hooks/useFormatDate";
import EditTransaction from "../../pages/SlaughterHouse/Transaction/EditTransaction";
import { clearId } from "../../services/animalsSlice";
import { fetchAnimalById, getAnimalById } from "../../services/animalsSlice";
import html2pdf from "html2pdf.js";
import Receipt from "../Receipt";
import { getTransactionStatus } from "../../utils/getTransactionStatus";
import Loading from "../../components/loader/loginloader/LoginLoading";
import transactionStatus from "../../constants/transactionStatus";
import { getUserData } from "../../services/authSlice";
import rolesList from "../../constants/rolesList";
import DemandLetter from "../../pages/Admin/Transaction/DemandLetter";
import io from "socket.io-client";
const socket = io.connect(`${api.defaults.baseURL}`);

// Utility to detect if it's a mobile device
const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const TransactionTable = ({ animalsList, fetchUpdate }) => {
  const { dateFormat } = useFormat();
  const toast = toastUtils();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const animal = useSelector(getAnimalById);
  const [deleteModal, setDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contentRef = useRef(null);
  const receiptRef = useRef(null);

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
    const element = receiptRef.current;

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

  const updateTransactionStatus = (id) => {
    dispatch(updateTransaction({ id, toast: toastUtils() }))
      .then(() => {
        setIsLoading(true);
        socket.emit("new_notification", { id });
        setTimeout(() => {
          fetchUpdate();
          setIsLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Demand Letter",
    onAfterPrint: () => console.log("Printing completed"),
    onPrintError: (errorLocation, error) =>
      console.error("Error:", errorLocation, error),
  });

  // const handleMobilePrint = () => {
  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.write(contentRef.current.outerHTML);
  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  // };

  const handlePrint = () => {
    // if (isMobileDevice()) {
    //   handleMobilePrint();
    // } else {
    handleReactToPrint();
    // }
  };

  const printDemandLetter = (id) => {
    dispatch(fetchAnimalById(id));

    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  // Sort animalsList by createdAt in descending order (most recent first)
  const sortedAnimalsList = animalsList
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <div className="flex items-center justify-center">
        {isLoading && <Loading />}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {animalsList.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-2 py-3 text-nowrap">TRANSACTION ID</th>
                <th className="px-2 py-3 text-nowrap">Type</th>
                <th className="px-2 py-3 text-nowrap">Weight (Kg)</th>
                <th className="px-2 py-3 text-nowrap">Price Per (Kg)</th>
                <th className="px-2 py-3 text-nowrap">Total</th>
                <th className="px-2 py-3 text-nowrap">Amount Paid</th>
                <th className="px-2 py-3 text-nowrap">Balance</th>
                {/* <th className="px-2 py-3 text-nowrap">Customer Name</th>
                <th className="px-2 py-3 text-nowrap">Customer Phone</th>
                <th className="px-2 py-3 text-nowrap">Customer Address</th> */}
                <th className="px-2 py-3 text-nowrap">Status</th>
                <th className="px-2 py-3 text-nowrap">Date</th>
                <th className="px-2 py-3 text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAnimalsList.map(
                ({
                  id,
                  type,
                  weight,
                  pricePerKg,
                  total,
                  transaction: { amountPaid, balance, status },
                  // createdAt,
                  slaughterDate,
                  // owner: { customerName, customerPhone, customerAddress },
                }) => (
                  // index
                  <tr
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transaction/${id}`);
                    }}
                    key={id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-2 py-4 text-nowrap">{id}</td>
                    <td className="px-2 py-4 text-nowrap">{type}</td>
                    <td className="px-2 py-4 text-nowrap">{weight}kg</td>
                    <td className="px-2 py-4 text-nowrap">₱ {pricePerKg}</td>
                    <td className="px-2 py-4 text-nowrap">₱ {total}</td>
                    <td className="px-2 py-4 text-nowrap">₱ {amountPaid}</td>
                    <td className="px-2 py-4 text-nowrap">₱ {balance}</td>
                    {/* <td className="px-2 py-4 text-nowrap">{customerName}</td>
                    <td className="px-2 py-4 text-nowrap">{customerPhone}</td>
                    <td className="px-2 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {customerAddress}
                    </td> */}
                    <td className="px-2 py-4 text-nowrap">
                      <p
                        className={`${getBgColor(
                          status
                        )} px-2 py-1 rounded-lg text-white text-center`}
                      >
                        {getTransactionStatus(status)}
                      </p>
                    </td>
                    <td className="px-2 py-4 text-nowrap">{slaughterDate}</td>
                    {user?.role === rolesList.admin ? (
                      <td className="px-2 py-4 flex gap-3 ">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/transaction/${id}`);
                          }}
                          className="p-2 text-lg bg-[#fca326] hover:bg-[#f58e40] text-white rounded-lg"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        {status !== transactionStatus.paid && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTransactionStatus(id);
                              }}
                              className="p-2 text-lg bg-green-500 hover:bg-green-700 text-white rounded-lg"
                            >
                              <FaCheckCircle className="h-5 w-5" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                printDemandLetter(id);
                              }}
                              className="p-2 text-lg bg-[#3577c2] hover:bg-[#2d4199] text-white rounded-lg"
                            >
                              <IoMdPrint className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        {/* <button
                          onClick={(e) => {
                            openEditModal(id);
                            e.stopPropagation();
                          }}
                          className="p-2 md:text-lg text-sm bg-[#3577c2] hover:bg-[#2d4199] text-white rounded-lg"
                        >
                          <FaRegEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            openDeleteModal({ id, name: customerName });
                            e.stopPropagation();
                          }}
                          className="p-2 md:text-lg text-sm hover:bg-red-700 bg-red-500 text-white rounded-lg"
                        >
                          <FaTrashAlt className="h-5 w-5" />
                        </button> */}
                      </td>
                    ) : (
                      <td className="px-2 py-4 flex gap-3 justify-center items-center relative">
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
                              className={`z-20 absolute flex flex-col right-[-25px]
                                 bottom-2

                              w-48 py-2 mt-2 bg-white rounded-md shadow-2xl transform translate-y-full`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPDF(id);
                                }}
                                className="w-full flex text-gray-700 items-center gap-2 py-2 px-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                              >
                                <span>
                                  <FaFileDownload className="h-4 w-4" />
                                </span>
                                Download Receipt
                              </button>
                              {/* {status !== transactionStatus.paid && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTransactionStatus(id);
                                  }}
                                  className="w-full flex text-green-700 items-center gap-2 py-2 px-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                                >
                                  <span>
                                    <FaCheckCircle className="h-4 w-4" />
                                  </span>
                                  Paid Transaction
                                </button>
                              )} */}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/transaction/${id}`);
                                  console.log(id);
                                }}
                                className="w-full flex text-orange-700 items-center gap-2 py-2 px-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
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
                                className="w-full flex items-center gap-2 text-blue-500 py-2 px-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
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
                                className="w-full flex items-center gap-2 text-red-500 py-2 px-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
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

        <div style={{ display: "none" }}>
          {" "}
          {/* Hidden offscreen */}
          <Receipt data={animal} contentRef={receiptRef} />
          <DemandLetter transactions={animal} contentRef={contentRef} />
        </div>

        {editModal && (
          <EditTransaction
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

TransactionTable.propTypes = {
  animalsList: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func,
};

export default TransactionTable;
