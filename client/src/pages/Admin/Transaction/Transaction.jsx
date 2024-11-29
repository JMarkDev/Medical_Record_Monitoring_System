import { useEffect, useState, useRef, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import {
  getFilteredAnimals,
  filterAllAnimals,
} from "../../../services/animalsSlice";
import api from "../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import TransactionTable from "../../../components/table/TransactionTable";
import Pagination from "../../../components/Pagination";
import { getUserData } from "../../../services/authSlice";
import Dropdown from "../../../components/dropdown/Dropdown";
import AnimalDropdown from "../../../components/dropdown/AnimalsDropdown";
import transactionStatus from "../../../constants/transactionStatus";
import PrintAll from "./PrintAll";
import io from "socket.io-client";
const socket = io.connect(`${api.defaults.baseURL}`);

const SlaughterTransaction = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const animals = useSelector(getFilteredAnimals);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalsList, setAnimalsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [animalType, setAnimalType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(null);
  const [unpaidList, setUnpaidList] = useState([]);
  const contentRef = useRef(null);

  const dataPerPage = 5;
  // useEffect(() => {
  //   dispatch(
  //     filterAllAnimals({
  //       type: animalType,
  //       startDate: startDate,
  //       endDate: endDate,
  //       slaughterhouseId: "All",
  //       transactionID: searchTerm,
  //       status: status,
  //     })
  //   );
  // }, [dispatch, animalType, startDate, endDate, user, searchTerm, status]);

  const fetchUpdate = useCallback(() => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: "All",
        transactionID: searchTerm,
        status: status,
      })
    );
  }, [dispatch, animalType, startDate, endDate, searchTerm, status]);

  useEffect(() => {
    fetchUpdate();
  }, [fetchUpdate]);

  useEffect(() => {
    if (animals) {
      setAnimalsList(animals);
    }
  }, [animals]);
  // const fetchUpdate = () => {
  //   dispatch(
  //     filterAllAnimals({
  //       type: animalType,
  //       startDate: startDate,
  //       endDate: endDate,
  //       slaughterhouseId: "All",
  //       transactionID: searchTerm,
  //       status: status,
  //     })
  //   );
  // };

  useEffect(() => {
    socket.on("success_add", () => {
      fetchUpdate();
    });
  }, [fetchUpdate]);

  const handleFilter = (status) => {
    setStatus(status);
  };

  const handleFilterByAnimal = (animal) => {
    if (animal === "Default" || animal === "All") {
      setAnimalType("All");
    } else {
      setAnimalType(animal);
    }
  };

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = animalsList?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (animals) {
      setAnimalsList(animals);

      // Filter unpaid transactions
      const unpaid = animals.filter(
        (animal) =>
          animal.transaction.status === transactionStatus.unpaid ||
          animal.transaction.status === transactionStatus.partial
      );
      setUnpaidList(unpaid);
    }
  }, [animals]);

  const handleReactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Demand Letter",
    onAfterPrint: () => console.log("Printing completed"),
    onPrintError: (errorLocation, error) =>
      console.error("Error:", errorLocation, error),
  });

  const handlePrintAll = () => {
    const unpaidTransactions = animalsList.filter(
      (animal) =>
        animal.transaction.status === transactionStatus.unpaid ||
        animal.transaction.status === transactionStatus.partial
    );

    if (unpaidTransactions.length > 0) {
      setTimeout(() => {
        handleReactToPrint();
      }, 500);
    }
  };

  return (
    <div>
      <div className="flex justify-end items-end gap-5  flex-col">
        <div className=" flex lg:flex-row flex-col justify-end w-full items-end relative gap-3">
          <div className=" flex max-w-[450px] w-full  items-center relative">
            <input
              type="text"
              placeholder="Search Transaction ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-blue-500 focus:border-blue  rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <IoSearch className="text-2xl absolute right-2 text-gray-600" />
          </div>

          <div className="flex justify-center items-center gap-3">
            <AnimalDropdown handleFilter={handleFilterByAnimal} />
            <Dropdown handleFilter={handleFilter} />
          </div>
          <button
            onClick={handlePrintAll}
            className="bg-blue-600 text-nowrap hover:bg-blue-700 text-white font-bold text-sm p-2 px-4 rounded-lg"
          >
            Print All Demand Letter
          </button>
        </div>
      </div>
      <div className="mt-8">
        <TransactionTable animalsList={currentData} fetchUpdate={fetchUpdate} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={animalsList?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
      <div style={{ display: "none" }}>
        {" "}
        {/* Hidden offscreen */}
        <PrintAll transactions={unpaidList} contentRef={contentRef} />
      </div>
    </div>
  );
};

export default SlaughterTransaction;
