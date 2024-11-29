import PropTypes from "prop-types";
import { useFormat } from "../../../hooks/useFormatDate";

const DemandLetter = ({ transactions, contentRef }) => {
  const { fullDateFormat } = useFormat();
  return (
    <div ref={contentRef} className="font-sans leading-relaxed ">
      <div className=" p-8 max-w-4xl mx-auto bg-white demand_letter">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">
            City Administration Office
          </h1>
          <p className="text-gray-600">Pagadian City, Zamboanga del Sur</p>
          <p className="text-gray-600">Phone: 0987654321</p>
        </header>

        <section className="mb-8">
          <p className="text-sm text-gray-700">
            Date:{" "}
            <span className="font-medium">
              {fullDateFormat(new Date().toLocaleDateString())}
            </span>
          </p>
          <p className="mt-4">
            To:{" "}
            <span className="font-semibold">
              {transactions?.owner.customerName}
            </span>
          </p>
          <p>Address: {transactions?.owner.customerAddress}</p>
          <p>Contact: {transactions?.owner.customerPhone}</p>
        </section>

        <section>
          <p className="font-bold text-lg mb-4">
            Subject:{" "}
            <span className="underline decoration-gray-400">
              Demand for Payment - Unpaid Transactions
            </span>
          </p>
          <p className="mt-4">Dear {transactions?.owner.customerName},</p>
          <p>
            We are writing to inform you about the outstanding transactions
            recorded by the City Administration Office. These transactions
            remain unpaid and are now due for settlement. Below are the details
            of the unpaid amounts for your reference:
          </p>

          <table className="w-full border-collapse border border-gray-400 mt-6 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-400 px-4 py-2">#</th>
                <th className="border border-gray-400 px-4 py-2">
                  Animal Type
                </th>
                <th className="border border-gray-400 px-4 py-2">
                  Weight (Kg)
                </th>
                <th className="border border-gray-400 px-4 py-2">Price/Kg</th>
                <th className="border border-gray-400 px-4 py-2">Total</th>
                <th className="border border-gray-400 px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-2">1</td>
                <td className="border border-gray-400 px-4 py-2">
                  {transactions?.type}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {transactions?.weight}kg
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  ₱{transactions?.pricePerKg}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  ₱{transactions?.total}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-red-600">
                  ₱{transactions?.transaction.balance}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6">
            The total unpaid amount is{" "}
            <span className="font-bold text-red-600">
              ₱{transactions?.transaction.balance}
            </span>
            . Please settle the balance at your earliest convenience.
          </p>
        </section>

        <section className="mt-12">
          <p>Thank you for your prompt attention to this matter.</p>
          <p className="mt-8">Best regards,</p>
          <p className="font-bold mt-4">City Administrator</p>
          <p>City Administration Office</p>
        </section>
      </div>
    </div>
  );
};

DemandLetter.propTypes = {
  transactions: PropTypes.object,
  contentRef: PropTypes.object,
};

export default DemandLetter;
