import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  // getAnimals,
  // filterAnimalsByType,
  // searchAnimals,
  filterAllAnimals,
  getFilteredAnimals,
} from "../../../services/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import AnimalsTable from "@/components/table/AnimalsTable";
import Pagination from "../../../components/Pagination";
import { getUserData } from "../../../services/authSlice";
import AddAnimal from "./AddAnimal";
import AnimalDropdown from "../../../components/dropdown/AnimalsDropdown";

const AnimalRecords = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  // const animals = useSelector(getAnimals);
  const allAnimals = useSelector(getFilteredAnimals);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [animalType, setAnimalType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dataPerPage = 5;

  useEffect(() => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: user?.id,
        name: searchTerm,
      })
    );
  }, [dispatch, animalType, startDate, endDate, user, searchTerm]);

  const handleFilterByAnimal = (type) => {
    if (type === "Default" || type === "All") {
      setAnimalType("All");
    } else {
      setAnimalType(type);
    }

    // dispatch(
    //   filterAnimalsByType({ type: animalType, slaughterhouseId: user?.id })
    // );
  };

  const fetchUpdate = () => {
    dispatch(
      filterAllAnimals({
        type: animalType,
        startDate: startDate,
        endDate: endDate,
        slaughterhouseId: user?.id,
        name: searchTerm,
      })
    );
  };

  const handleAddAnimal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = allAnimals?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex justify-between gap-5 lg:flex-row flex-col">
        <button
          onClick={handleAddAnimal}
          className="w-fit text-nowrap p-2 px-6 rounded-lg bg-main hover:bg-main_hover text-white font-semi"
        >
          Add Animal
        </button>
        {showModal && (
          <AddAnimal closeModal={closeModal} fetchUpdate={fetchUpdate} />
        )}

        <div className="flex items-center gap-3">
          <div className=" flex  w-full  items-center relative">
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-blue-500 focus:border-blue lg:w-[450px] rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <IoSearch className="text-2xl absolute right-2 text-gray-600" />
          </div>
          <AnimalDropdown handleFilter={handleFilterByAnimal} />
        </div>
      </div>
      <div className="mt-8">
        <AnimalsTable animalsList={currentData} fetchUpdate={fetchUpdate} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={allAnimals?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimalRecords;
