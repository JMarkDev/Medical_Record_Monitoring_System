import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";
import {
  getAllUsers,
  fetchUsers,
  searchSlaughterhouseRole,
} from "../../../services/usersSlice";
import SlaughterhouseTable from "../../../components/table/SlaughterhouseTable";
import rolesList from "../../../constants/rolesList";

const Slaughterhouse = () => {
  const dispatch = useDispatch();
  const supervisor = useSelector(getAllUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  const fetchUpdate = () => {
    dispatch(fetchUsers(rolesList?.supervisor));
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchSlaughterhouseRole(searchTerm));
    } else {
      dispatch(fetchUsers(rolesList?.supervisor));
    }
  }, [searchTerm, dispatch]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = supervisor?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex text-sm md:text-[16px] justify-end gap-5">
        <div className=" flex max-w-[450px] w-full items-center relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-blue-500 focus:border-blue  rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <IoSearch className="text-2xl absolute right-2 text-gray-600" />
        </div>
      </div>
      <div className="mt-8">
        <SlaughterhouseTable users={currentData} fetchUpdate={fetchUpdate} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={currentData?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Slaughterhouse;
