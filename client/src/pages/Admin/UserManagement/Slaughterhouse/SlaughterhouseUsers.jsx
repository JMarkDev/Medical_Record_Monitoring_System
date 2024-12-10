import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import AddSlaughterhouse from "./AddSlaughterhouse";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../../components/Pagination";
import {
  getAllUsers,
  fetchUsers,
  // searchSlaughterhouseRole,
} from "../../../../services/usersSlice";
import UserTable from "../../../../components/table/UserTable";
import rolesList from "../../../../constants/rolesList";

const Slaughterhouse = () => {
  const dispatch = useDispatch();
  const supervisor = useSelector(getAllUsers);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  const fetchUpdate = () => {
    dispatch(fetchUsers(rolesList?.supervisor));
  };

  const openModal = () => {
    setShowModal(!showModal);
  };

  const closeModal = (modal) => {
    setShowModal(modal);
  };

  // useEffect(() => {
  //   if (searchTerm) {
  //     dispatch(searchSlaughterhouseRole(searchTerm));
  //   } else {
  //     dispatch(fetchUsers(rolesList?.supervisor));
  //   }
  // }, [searchTerm, dispatch]);

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
      <div className="flex text-sm md:text-[16px] justify-between lg:flex-row flex-col-reverse gap-5">
        <div className=" flex max-w-[450px] w-full  items-center relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-blue-500 focus:border-blue  rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <IoSearch className="text-2xl absolute right-2 text-gray-600" />
        </div>
        <button
          onClick={openModal}
          className="w-fit p-2 px-6 rounded-lg bg-main hover:bg-main_hover text-white font-semi"
        >
          Add Supervisor
        </button>
        {showModal && (
          <AddSlaughterhouse
            modal={openModal}
            closeModal={closeModal}
            showModal={showModal}
            // officeId={user?.office?.id}
          />
        )}
      </div>
      <div className="mt-8">
        <UserTable users={currentData} fetchUpdate={fetchUpdate} />
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
