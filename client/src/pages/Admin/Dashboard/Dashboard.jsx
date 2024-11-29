import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getFilteredAnimals,
  filterAllAnimals,
} from "../../../services/animalsSlice";
import { getUserData } from "../../../services/authSlice";
import { useFormat } from "../../../hooks/useFormatDate";
import DonutChart from "../../../components/charts/DonutChart";
import BarChart from "../../../components/charts/BarChart";
import transactionStatus from "../../../constants/transactionStatus";
import LineChartDocumentSubmissions from "../../../components/charts/LineChart";
import Cards from "../../../components/Cards";
import io from "socket.io-client";
import api from "../../../api/axios";
const socket = io.connect(`${api.defaults.baseURL}`);

const statusLabels = {
  1: "Unpaid",
  2: "Paid",
  3: "Partial",
};

const SlaughterDashboard = () => {
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

  const filterAnimals = useCallback(() => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: "All",
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
    searchTerm,
    status,
    searchOption,
  ]);

  useEffect(() => {
    filterAnimals();
  }, [filterAnimals]);

  useEffect(() => {
    const handleSuccess = () => {
      filterAnimals();
    };

    socket.on("success_add", handleSuccess);

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("success_add", handleSuccess);
    };
  }, [filterAnimals]);

  // Sample data transformation or summary calculation for additional charts
  const chartData = animals.map((animal) => ({
    type: animal.type,
    pricePerKg: animal.pricePerKg,
    weight: animal.weight,
  }));

  // Aggregate data for the Donut Chart
  const pieData = Object.keys(transactionStatus).map((key) => ({
    name: statusLabels[transactionStatus[key]],
    value: animals.filter(
      (animal) => animal.transaction?.status === transactionStatus[key]
    ).length,
  }));

  const unpaid = animals.reduce(
    (acc, curr) => acc + parseFloat(curr.transaction?.balance || 0),
    0
  );
  const paid = animals.reduce(
    (acc, curr) => acc + parseFloat(curr.transaction?.amountPaid || 0),
    0
  );

  const partial = animals.reduce((acc, curr) => {
    if (curr.transaction?.status === transactionStatus.partial) {
      return acc + parseFloat(curr.transaction.amountPaid || 0);
    }
    return acc; // If not partial, return the current accumulator value.
  }, 0); // Initial value of accumulator is 0.

  const overallPrice = animals.reduce(
    (acc, curr) => acc + curr.pricePerKg * curr.weight,
    0
  );

  const dateFormatted = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const todaysTransactions = animals.filter(
    (animal) => dateFormatted(animal.createdAt) === dateFormatted(new Date())
  );

  const cardData = [
    { title: "Total Transactions", value: animals.length },
    {
      title: "Today's Transactions",
      value: todaysTransactions.length,
    },
    {
      title: "Total Unpaid Transactions",
      value: animals.filter(
        (animal) => animal.transaction?.status !== transactionStatus.paid
      ).length,
    },
    {
      title: "Total Paid Transactions",
      value: animals.filter(
        (animal) => animal.transaction?.status === transactionStatus.paid
      ).length,
    },
    {
      title: "Overall Price",
      value: `₱${overallPrice.toFixed(2)}`,
    },
    {
      title: "Total Unpaid Amount ",
      value: `₱${unpaid.toFixed(2)}`,
    },

    {
      title: "Total Amount Paid",
      value: `₱${paid.toFixed(2)}`,
    },
    {
      title: "Total Amount Partially Paid",
      value: `₱${partial.toFixed(2)}`,
    },
  ];

  return (
    <div className="w-full">
      <div className=" flex flex-wrap">
        <Cards data={cardData} />
      </div>
      <div className="mt-10">
        <h1 className="font-bold bg-gray-300 mb-5 p-2">Transaction Chart</h1>
        <LineChartDocumentSubmissions data={animals} />
      </div>

      {/* Bar Chart */}
      <div className="mt-10 flex xl:flex-row flex-col gap-3 items-center">
        <div className="shadow-xl  w-full rounded-lg p-2">
          <h1 className="font-bold bg-gray-300 text-gray-700 mb-5 p-2">
            Animal overall price and weight
          </h1>
          <BarChart data={chartData} />
        </div>

        <div className="shadow-xl w-full rounded-lg p-2">
          <h1 className="font-bold bg-gray-300 text-gray-700 mb-5 p-2">
            Transaction Status Chart
          </h1>
          <DonutChart data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default SlaughterDashboard;
