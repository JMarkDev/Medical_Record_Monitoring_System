import PropTypes from "prop-types";
import api from "../../../api/axios";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../services/authSlice";
import {
  clearSearch,
  fetchAnimalById,
  getAnimalById,
} from "../../../services/animalsSlice";

const EditTransaction = ({ modal, closeModal, fetchUpdate, id }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(getUserData);
  const animal = useSelector(getAnimalById);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [total, setTotal] = useState(0.0);
  const [balance, setBalance] = useState(0.0);
  const [data, setData] = useState({
    customerName: "",
    customerAddress: location,
    customerPhone: "",
    type: "",
    slaughterDate: "",
    weight: "",
    pricePerKg: "",
    total: 0.0,
    paidAmount: 0.0,
    balance: 0.0,
    status: "",
    slaughterhouseId: "",
  });

  const [animalTypeError, setAnimalTypeError] = useState("");
  const [dateSlaughteredError, setDateSlaughteredError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [pricePerKgError, setPricePerKgError] = useState("");
  const [totalError, setTotalError] = useState("");
  const [paidAmountError, setPaidAmountError] = useState("");
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    dispatch(fetchAnimalById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (animal?.owner?.customerAddress) {
      setLocation(animal.owner.customerAddress);
    }

    setData({
      customerName: animal?.owner?.customerName,
      customerAddress: animal?.owner?.customerAddress,
      customerPhone: animal?.owner?.customerPhone,
      type: animal?.type,
      slaughterDate: animal?.slaughterDate,
      weight: animal?.weight,
      pricePerKg: animal?.pricePerKg,
      total: animal?.total,
      paidAmount: animal?.transaction?.amountPaid,
      balance: animal?.transaction?.balance,
      status: animal?.transaction?.status,
      slaughterhouseId: animal?.slaughterhouseId,
    });
  }, [animal, user]);

  useEffect(() => {
    // Calculate total and balance
    if (data.weight === "" || !data.pricePerKg) return;

    const totalPrice = (data.weight * data.pricePerKg).toFixed(2);
    const paidAmount = data.paidAmount ? parseFloat(data.paidAmount) : 0.0;
    const balance = (totalPrice - paidAmount).toFixed(2);

    // Update state with formatted values
    setTotal(totalPrice);
    setBalance(balance);

    setData((prevData) => ({
      ...prevData,
      total: totalPrice,
      balance: balance,
    }));

    // Set transaction status based on payment amount
    let status;
    if (paidAmount >= parseFloat(totalPrice) && paidAmount !== 0.0) {
      status = "Paid";
    } else if (paidAmount < totalPrice && paidAmount !== 0.0) {
      status = "Partial";
    } else if (paidAmount === 0.0) {
      status = "Unpaid";
    }
    setData((prevData) => ({ ...prevData, status: status }));
  }, [data.weight, data.pricePerKg, data.paidAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAnimalTypeError("");
    setDateSlaughteredError("");
    setWeightError("");
    setPricePerKgError("");
    setTotalError("");
    setPaidAmountError("");
    setBalanceError("");

    try {
      const response = await api.put(`/animals/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        fetchUpdate();
        closeModal();
        dispatch(clearSearch());
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "type":
              setAnimalTypeError(`Animal ${error.msg}`);
              break;
            case "slaughterDate":
              setDateSlaughteredError(error.msg);
              break;
            case "weight":
              setWeightError(error.msg);
              break;
            case "pricePerKg":
              setPricePerKgError(error.msg);
              break;
            case "total":
              setTotalError(error.msg);
              break;
            case "paidAmount":
              setPaidAmountError(error.msg);
              break;
            case "balance":
              setBalanceError(error.msg);
              break;

            default:
              console.log(error);
          }
        });
      }
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        role="dialog"
        aria-hidden={!modal}
        className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
      >
        {loading && <LoginLoading />}
        <div className="relative  w-full max-w-2xl max-h-full py-5 ">
          <div className="relative  text-gray-800 bg-white rounded-xl shadow-lg">
            <div className="flex border-b border-gray-300 items-center justify-center">
              <h1 className="md:text-2xl font-bold text-lg p-4 text-gray-700">
                Update Transaction
              </h1>
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  closeModal(false);
                  dispatch(clearSearch());
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            <form action="" method="POST" onSubmit={handleSubmit}>
              <div className="p-6 bg-white space-y-4 text-sm text-[#221f1f]">
                <h1 className="mt-4 text-lg font-bold text-gray-700">
                  Animal Transaction Details
                </h1>
                <div className="mt-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Animal Type
                  </label>
                  <select
                    name=""
                    id=""
                    value={data?.type || ""} // Set the input value to the selected animal type
                    onChange={(e) => setData({ ...data, type: e.target.value })}
                    className={`border-gray-300 ${
                      animalTypeError ? "border-red-500" : "border-gray-300"
                    }
              bg-gray-100 border w-full py-2.5  text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                  >
                    <option value="">Select Animal Type</option>
                    <option value="Cattle">Cattle</option>
                    <option value="Pigs">Pigs</option>
                    <option value="Goats">Goats</option>
                  </select>
                  {animalTypeError && (
                    <span className="text-red-500 text-sm">
                      {animalTypeError}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex gap-3 ">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Date Slaughtered
                    </label>
                    <input
                      type="date"
                      id="name"
                      onChange={(e) =>
                        setData({ ...data, slaughterDate: e.target.value })
                      }
                      defaultValue={data?.slaughterDate} // Set the input value to the selected slaughter date
                      className={`   ${
                        dateSlaughteredError
                          ? "border-red-500"
                          : "border-gray-300"
                      }
      border-gray-300 
              bg-gray-100 border w-full py-2.5  text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                      placeholder="Animal Type"
                    />
                    {dateSlaughteredError && (
                      <span className="text-red-500 text-sm">
                        {dateSlaughteredError}
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Total Weight(Kg)
                    </label>
                    <input
                      type="number"
                      id="name"
                      onChange={(e) =>
                        setData({ ...data, weight: e.target.value })
                      }
                      value={data.weight || ""}
                      pattern="[0-9]*" // Only allows numbers
                      inputMode="numeric" // Opens numeric keyboard on mobile
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "."
                        ) {
                          e.preventDefault(); // Prevent non-numeric characters
                        }
                      }}
                      className={`${
                        weightError ? "border-red-500" : "border-gray-300"
                      }
    border-gray-300 
    bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                      placeholder="Weight"
                    />

                    {weightError && (
                      <span className="text-red-500 text-sm">
                        {weightError}
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price per(Kg)
                    </label>
                    <input
                      type="number"
                      id="name"
                      defaultValue={data?.pricePerKg || ""} // Set the input value to the selected price per kg
                      onChange={(e) =>
                        setData({ ...data, pricePerKg: e.target.value })
                      }
                      pattern="[0-9]*" // Only allows numbers
                      inputMode="numeric" // Opens numeric keyboard on mobile
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "."
                        ) {
                          e.preventDefault(); // Prevent non-numeric characters
                        }
                      }}
                      className={`
                        ${
                          pricePerKgError ? "border-red-500" : "border-gray-300"
                        }
      border-gray-300 
              bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                      placeholder="Price per(Kg)"
                    />
                    {pricePerKgError && (
                      <span className="text-red-500 text-sm">
                        {pricePerKgError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Total Price
                    </label>
                    <input
                      type="number"
                      id="name"
                      onChange={(e) =>
                        setData({ ...data, total: e.target.value })
                      }
                      pattern="[0-9]*" // Only allows numbers
                      inputMode="numeric" // Opens numeric keyboard on mobile
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "."
                        ) {
                          e.preventDefault(); // Prevent non-numeric characters
                        }
                      }}
                      value={total || ""}
                      disabled={true}
                      className={`  ${
                        totalError ? "border-red-500" : "border-gray-300"
                      }
      border-gray-300 
              bg-gray-100 cursor-not-allowed border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                      placeholder="Total Price"
                    />
                    {totalError && (
                      <span className="text-red-500 text-sm">{totalError}</span>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Paid Amount
                    </label>
                    <input
                      type="number"
                      id="name"
                      onChange={(e) =>
                        setData({ ...data, paidAmount: e.target.value })
                      }
                      pattern="[0-9]*" // Only allows numbers
                      inputMode="numeric" // Opens numeric keyboard on mobile
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "."
                        ) {
                          e.preventDefault(); // Prevent non-numeric characters
                        }
                      }}
                      defaultValue={data.paidAmount || ""}
                      className={` ${
                        paidAmountError ? "border-red-500" : "border-gray-300"
                      }
      border-gray-300 
              bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                      placeholder="Paid Amount"
                    />
                    {paidAmountError && (
                      <span className="text-red-500 text-sm">
                        {paidAmountError}
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Balance
                    </label>
                    <input
                      type="number"
                      id="name"
                      onChange={(e) =>
                        setData({ ...data, balance: e.target.value })
                      }
                      pattern="[0-9]*" // Only allows numbers
                      inputMode="numeric" // Opens numeric keyboard on mobile
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "."
                        ) {
                          e.preventDefault(); // Prevent non-numeric characters
                        }
                      }}
                      value={balance || ""}
                      disabled={true}
                      className={` ${
                        balanceError ? "border-red-500" : "border-gray-300"
                      }
      border-gray-300 
              bg-gray-100 border w-full py-2.5 cursor-not-allowed text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                      placeholder="Balance"
                    />
                    {balanceError && (
                      <span className="text-red-500 text-sm">
                        {balanceError}
                      </span>
                    )}
                  </div>
                </div>
                <div className=" pt-4  flex justify-end gap-3">
                  <button
                    onClick={() => {
                      closeModal(false);
                      dispatch(clearSearch());
                    }}
                    type="button"
                    className="bg-gray-500 py-2.5 hover:bg-gray-700 text-white p-2 px-8 rounded-lg "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-main py-2.5 hover:bg-main_hover text-white p-2 px-8 rounded-lg "
                  >
                    Update Transaction
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

EditTransaction.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
  fetchUpdate: PropTypes.func,
  id: PropTypes.string,
};

export default EditTransaction;
