import PropTypes from "prop-types";
import { getTransactionStatus } from "../utils/getTransactionStatus";

const Receipt = ({ data, contentRef }) => (
  <div
    ref={contentRef}
    className="max-w-sm mx-auto p-8 border border-gray-300 shadow-xl rounded-lg bg-white"
  >
    {/* Header */}
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Animal Transaction Receipt
      </h2>
      <p className="text-gray-500 text-sm">
        Transaction ID: {data?.transactionId}
      </p>
    </div>

    {/* Customer Details */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
        Customer Details
      </h3>
      <div className="text-sm space-y-1">
        <p className="text-gray-600">
          <strong>Name:</strong> {data?.owner?.customerName}
        </p>
        <p className="text-gray-600">
          <strong>Address:</strong> {data?.owner?.customerAddress}
        </p>
        <p className="text-gray-600">
          <strong>Phone Number:</strong> {data?.owner?.customerPhone}
        </p>
      </div>
    </div>

    {/* Animal Transaction Details */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
        Animal Transaction Details
      </h3>
      <div className="text-sm space-y-1">
        <p className="text-gray-600">
          <strong>Animal Type:</strong> {data?.type}
        </p>
        <p className="text-gray-600">
          <strong>Date Slaughtered:</strong> {data?.slaughterDate}
        </p>
        <p className="text-gray-600">
          <strong>Total Weight (Kg):</strong> {data?.weight} Kg
        </p>
        <p className="text-gray-600">
          <strong>Price per Kg:</strong> ₱{data?.pricePerKg}
        </p>
        <p className="text-gray-600">
          <strong>Total Price:</strong> ₱{data?.total}
        </p>
      </div>
    </div>

    {/* Payment Summary */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
        Payment Summary
      </h3>
      <div className="text-sm space-y-1">
        <p className="text-gray-600">
          <strong>Paid Amount:</strong> ₱{data?.transaction?.amountPaid}
        </p>
        <p className="text-gray-600">
          <strong>Balance:</strong> ₱{data?.transaction?.balance}
        </p>
        <p className={`text-gray-600`}>
          <strong>Status:</strong>{" "}
          {getTransactionStatus(data?.transaction?.status)}
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="text-center mt-6 border-t border-gray-200 pt-4">
      <p className="text-gray-500 text-xs italic">
        Thank you for your transaction!
      </p>
    </div>
  </div>
);

Receipt.propTypes = {
  data: PropTypes.object,
  contentRef: PropTypes.object,
};

export default Receipt;
