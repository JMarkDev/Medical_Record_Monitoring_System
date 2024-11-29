import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  getFilteredAnimals,
  // searchTransaction,
  getTransactionBySlaughterhouse,
  filterAllAnimals,
  // filterByDateRange,
} from "../../../services/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import TransactionTable from "../../../components/table/TransactionTable";
import Pagination from "../../../components/Pagination";
import { getUserData } from "../../../services/authSlice";
import Dropdown from "../../../components/dropdown/Dropdown";
import AnimalDropdown from "../../../components/dropdown/AnimalsDropdown";

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

  const dataPerPage = 5;
  useEffect(() => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: user?.id,
        transactionID: searchTerm,
        status: status,
      })
    );
  }, [dispatch, animalType, startDate, endDate, user, searchTerm, status]);

  useEffect(() => {
    if (animals) {
      setAnimalsList(animals);
    }
  }, [animals]);

  const fetchUpdate = () => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: user?.id,
        transactionID: searchTerm,
        status: status,
      })
    );
  };

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
    </div>
  );
};

export default SlaughterTransaction;
