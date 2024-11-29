import Back from "../../components/buttons/Back";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimalById, getAnimalById } from "../../services/animalsSlice";
import { useEffect } from "react";
import { getBgColor } from "../../utils/animalBgStatus";
import { getTransactionStatus } from "../../utils/getTransactionStatus";

const TransactionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getAnimalById);

  useEffect(() => {
    dispatch(fetchAnimalById(id));
  }, [dispatch, id]);

  return (
    <div className="bg-gray-50 min-h-screen ">
      <div className="flex items-center gap-5 mb-8">
        <Back />
        <h1 className="font-bold lg:text-3xl text-xl text-gray-900">
          Transaction Details
        </h1>
      </div>
      <div className="max-w-lg mx-auto p-8 border border-gray-200 shadow-xl rounded-lg bg-white">
        <h2 className="lg:text-2xl text-lg font-semibold text-center text-gray-700 mb-6">
          Animal Transaction Receipt
        </h2>

        {/* Transaction ID */}
        <p className="text-center text-gray-600 mb-4">
          <span className="font-medium text-gray-900">Transaction ID:</span>{" "}
          {data?.transactionId}
        </p>

        {/* Customer Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Customer Details
          </h3>
          <p className="text-gray-700 mb-1">
            <strong>Name:</strong> {data?.owner?.customerName}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Address:</strong> {data?.owner?.customerAddress}
          </p>
          <p className="text-gray-700">
            <strong>Phone Number:</strong> {data?.owner?.customerPhone}
          </p>
        </div>

        {/* Animal Transaction Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Animal Transaction Details
          </h3>
          <p className="text-gray-700 mb-1">
            <strong>Animal Type:</strong> {data?.type}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Date Slaughtered:</strong> {data?.slaughterDate}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Total Weight:</strong> {data?.weight} Kg
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Price per Kg:</strong> ₱{data?.pricePerKg}
          </p>
          <p className="text-gray-700">
            <strong>Total Price:</strong> ₱{data?.total}
          </p>
        </div>

        {/* Payment Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Payment Summary
          </h3>
          <p className="text-gray-700 mb-1">
            <strong>Paid Amount:</strong> ₱{data?.transaction?.amountPaid}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Balance:</strong> ₱{data?.transaction?.balance}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Status:</strong>{" "}
            {/* <span className="font-semibold text-red-500">
              {data?.transaction?.status}
            </span> */}
            <span
              className={`${getBgColor(
                data?.transaction?.status
              )} text-white w-fit px-4 py-1 rounded-lg text-center `}
            >
              {getTransactionStatus(data?.transaction?.status)}
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for your transaction!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
