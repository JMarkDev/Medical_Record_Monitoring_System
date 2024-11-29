import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReportsTable from "../../../components/table/ReportsTable";
// import { IoSearch } from "react-icons/io5";

import {
  getFilteredAnimals,
  filterAllAnimals,
  // filterByDateRange,
} from "../../../services/animalsSlice";
import { getUserData } from "../../../services/authSlice";
import LineChartDocumentSubmissions from "../../../components/charts/LineChart";
import { useFormat } from "../../../hooks/useFormatDate";
import transactionStatus from "../../../constants/transactionStatus";

const Reports = () => {
  const dispatch = useDispatch();
  const { dateFormat } = useFormat();
  const user = useSelector(getUserData);
  const animals = useSelector(getFilteredAnimals);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(null);
  const [searchOption, setSearchOption] = useState("transactionId");

  useEffect(() => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: user?.id,
        transactionID: searchOption === "transactionId" ? searchTerm : "",
        customerName: searchOption === "customerName" ? searchTerm : "",
        status: status,
      })
    );
  }, [
    dispatch,
    animalType,
    startDate,
    endDate,
    user,
    searchTerm,
    status,
    searchOption,
  ]);

  const downloadCsv = () => {
    const headers = [
      "Transaction ID",
      "Customer Name",
      "Customer Phone",
      "Customer Address",
      "Condition",
      "Price Per Kg",
      "Total",
      "Amount Paid",
      "Balance",
      "Date",
    ];

    const formatFieldCsv = (field) => {
      if (/[,]/.test(field)) {
        return `"${field}"`;
      }
      return field;
    };

    const dataRows = animals?.map((response) => {
      return [
        formatFieldCsv(response.transactionId), // Transaction ID
        formatFieldCsv(response.owner?.customerName), // Customer Name
        formatFieldCsv(response.owner?.customerPhone), // Customer Phone
        formatFieldCsv(response.owner?.customerAddress), // Customer Address
        formatFieldCsv(response.condition), // Condition
        formatFieldCsv(`₱ ${response.pricePerKg}`), // Price Per Kg
        formatFieldCsv(`₱ ${response.total}`), // Total
        formatFieldCsv(`₱ ${response.transaction?.amountPaid}`), // Amount Paid
        formatFieldCsv(`₱ ${response.transaction?.balance}`), // Balance
        formatFieldCsv(dateFormat(response.createdAt)), // Created At (formatted)
      ];
    });

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    // Add UTF-8 BOM to the start of the file
    const csvWithBom = "\uFEFF" + csvContent;

    const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Transaction_Reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        <div className="">
          <div className="relative w-full ">
            <input
              type="date"
              id="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`border-blue-500 
                           block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
            />
            <label
              htmlFor="from_date"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Start Date
            </label>
          </div>
        </div>
        <div className="">
          <div className="relative w-full ">
            <input
              type="date"
              id="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`border-blue-500 
                           block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
              placeholder=" "
            />
            <label
              htmlFor="from_date"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              End Date
            </label>
          </div>
        </div>
        <div className="">
          <div className="relative w-full ">
            <select
              value={animalType || ""}
              onChange={(e) => setAnimalType(e.target.value)}
              className="border-blue-500 block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="">Filter by animal type</option>
              <option value="Cattle">Cattle</option>
              <option value="Pigs">Pigs</option>
              <option value="Goats">Goats</option>
            </select>
          </div>
        </div>
        <div className="">
          <div className="relative w-full ">
            <select
              value={status || ""}
              onChange={(e) => setStatus(e.target.value)}
              className="border-blue-500 block w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="">Filter by status</option>
              <option value={transactionStatus.paid}>Paid</option>
              <option value={transactionStatus.unpaid}>Unpaid</option>
              <option value={transactionStatus.partial}>Partial</option>
            </select>
          </div>
        </div>
      </div>
      <div className="relative flex justify-between flex-col md:flex-row mt-5 gap-3">
        <div className="flex md:w-[500px] w-full">
          {/* Dropdown and Search Input */}
          <div className="flex items-center relative w-full gap-2">
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              className="border absolute right-0 border-blue-600 text-sm  bg-gray-100 border-r rounded-r-lg px-2 py-2 focus:outline-none focus:ring-0"
            >
              <option value="transactionId">Transaction ID</option>
              <option value="customerName">Customer Name</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${
                searchOption === "transactionId"
                  ? "Transaction ID"
                  : "Customer Name"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border focus:border-blue text-sm  rounded-xl bg-gray-100 focus:outline-none focus:ring-0 border-blue-600 peer"
            />
            {/* <IoSearch className="text-2xl right-3 absolute text-gray-600" /> */}
          </div>
        </div>
        {/* Download Reports Button */}
        <button
          onClick={downloadCsv}
          className="bg-blue-600 text-nowrap w-fit hover:bg-blue-700 text-white rounded-lg py-2 px-4"
        >
          Download Reports
        </button>
      </div>

      <div className="mt-5">
        <ReportsTable animalsList={animals} />
      </div>
      <div className="mt-10">
        <h1 className="font-bold mb-5">Transaction Chart</h1>
        <LineChartDocumentSubmissions data={animals} />
      </div>
    </div>
  );
};

export default Reports;
