import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  filterAllAnimals,
  getFilteredAnimals,
} from "../../../../services/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import AnimalsTable from "@/components/table/AnimalsTable";
import Pagination from "../../../../components/Pagination";
import { getUserData } from "../../../../services/authSlice";

const AnimalRecords = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const allAnimals = useSelector(getFilteredAnimals);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dataPerPage = 5;

  useEffect(() => {
    dispatch(
      filterAllAnimals({
        type: "Cattle",
        startDate: "",
        endDate: "",
        slaughterhouseId: "All",
        name: searchTerm,
      })
    );
  }, [dispatch, user, searchTerm]);

  const fetchUpdate = () => {
    dispatch(
      filterAllAnimals({
        type: "Cattle",
        startDate: "",
        endDate: "",
        slaughterhouseId: "All",
        name: searchTerm,
      })
    );
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
      <div className="flex justify-end gap-5 lg:flex-row flex-col">
        <div className="flex items-center  gap-3">
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
          {/* <AnimalDropdown handleFilter={handleFilterByAnimal} /> */}
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
