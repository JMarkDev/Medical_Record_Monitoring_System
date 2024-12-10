import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import AddPatients from "./AddPatients";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";
import PatientTable from "../../../components/table/PatientTable";
import {
  getAllPatients,
  fetchAllPatients,
  searchPatient,
  reset,
} from "../../../services/patientSlice";

const PatientRecords = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const patients = useSelector(getAllPatients);
  const [status, setStatus] = useState("Admitted");

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (status) {
      dispatch(fetchAllPatients(status));
    }
  }, [dispatch, status]);

  const fetchUpdate = () => {
    dispatch(fetchAllPatients(status));
  };

  const openModal = () => {
    setShowModal(!showModal);
  };

  const closeModal = (modal) => {
    setShowModal(modal);
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchPatient({ searchQuery: searchTerm, status: status }));
    } else {
      dispatch(fetchAllPatients(status));
    }
  }, [searchTerm, dispatch, status]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = patients?.slice(
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
          className="w-fit p-2 px-6 rounded-lg bg-primary hover:bg-primary text-white font-semi"
        >
          Add Patient
        </button>
        {showModal && (
          <AddPatients
            modal={openModal}
            closeModal={closeModal}
            showModal={showModal}
            fetchUpdate={fetchUpdate}
            // officeId={user?.office?.id}
          />
        )}
      </div>
      <div className="mt-8">
        {/* <UserTable users={currentData} fetchUpdate={fetchUpdate} /> */}
        <PatientTable patients={currentData} fetchUpdate={fetchUpdate} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={patients?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
