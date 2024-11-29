import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import NoData from "../NoData";
import { getBgColor } from "../../utils/animalBgStatus";
import { useFormat } from "../../hooks/useFormatDate";

import { getTransactionStatus } from "../../utils/getTransactionStatus";
const ReportsTable = ({ animalsList }) => {
  const { dateFormat } = useFormat();
  const navigate = useNavigate();

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
                <th className="px-4 py-3 text-nowrap">TRANSACTION ID</th>
                <th className="px-4 py-3 text-nowrap">Customer Name</th>
                <th className="px-4 py-3 text-nowrap">Type</th>
                <th className="px-4 py-3 text-nowrap">Weight (Kg)</th>
                <th className="px-4 py-3 text-nowrap">Price Per (Kg)</th>
                <th className="px-4 py-3 text-nowrap">Total</th>
                <th className="px-4 py-3 text-nowrap">Amount Paid</th>
                <th className="px-4 py-3 text-nowrap">Balance</th>
                {/* <th className="px-4 py-3 text-nowrap">Customer Name</th>
                <th className="px-4 py-3 text-nowrap">Customer Phone</th>
                <th className="px-4 py-3 text-nowrap">Customer Address</th> */}
                <th className="px-4 py-3 text-nowrap">Status</th>
                <th className="px-4 py-3 text-nowrap">Date</th>
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
                    total,
                    transaction: { amountPaid, balance, status },
                    createdAt,
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
                    <td className="px-4 py-4 text-nowrap">{id}</td>
                    <td className="px-4 py-4 text-nowrap">{customerName}</td>

                    <td className="px-4 py-4 text-nowrap">{type}</td>
                    <td className="px-4 py-4 text-nowrap">{weight}kg</td>
                    <td className="px-4 py-4 text-nowrap">₱ {pricePerKg}</td>
                    <td className="px-4 py-4 text-nowrap">₱ {total}</td>
                    <td className="px-4 py-4 text-nowrap">₱ {amountPaid}</td>
                    <td className="px-4 py-4 text-nowrap">₱ {balance}</td>
                    <td className="px-4 py-4 text-nowrap">
                      <p
                        className={`${getBgColor(
                          status
                        )} px-2 py-1 rounded-lg text-white text-center`}
                      >
                        {getTransactionStatus(status)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-nowrap">
                      {dateFormat(createdAt)}
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

ReportsTable.propTypes = {
  animalsList: PropTypes.array.isRequired,
  fetchUpdate: PropTypes.func,
};

export default ReportsTable;
