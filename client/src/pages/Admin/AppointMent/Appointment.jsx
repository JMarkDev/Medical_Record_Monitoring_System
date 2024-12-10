import { useEffect, useState, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";
import AppointmentTable from "../../../components/table/AppointmentTable";
import api from "../../../api/axios";
import { getUserData } from "../../../services/authSlice";
import SuccessAppointment from "../../../components/SuccessAppointment";

const Appointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const user = useSelector(getUserData);
  const [appointmentList, setAppointmentList] = useState([]);
  const [successModal, setSuccessModal] = useState(false);

  const getAllAppointments = useCallback(async () => {
    try {
      const response = await api.get("/appointment/get-all");
      setAppointmentList(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllAppointments();
  }, [getAllAppointments]);

  const searchAppointment = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        doctorId: "all",
        ...(searchTerm && { name: searchTerm }), // Only include 'search' if searchTerm is defined
      });

      const response = await api.get(
        `/appointment/search-appointment?${params.toString()}`
      );
      setAppointmentList(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      searchAppointment();
    } else {
      getAllAppointments();
    }
  }, [getAllAppointments, searchTerm, searchAppointment]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = appointmentList?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeSuccessModal = () => {
    setSuccessModal(false);
  };

  return (
    <div>
      <div className="flex text-sm md:text-[16px] justify-end  lg:flex-row flex-col-reverse gap-5">
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
        {successModal && (
          <SuccessAppointment
            openModal={successModal}
            closeSuccessModal={closeSuccessModal}
            doctor={`${user?.firstName} ${user?.middleInitial}. ${user?.lastName}`}
          />
        )}
      </div>

      <div className="mt-8">
        {/* <UserTable users={currentData} fetchUpdate={fetchUpdate} /> */}
        <AppointmentTable
          appointmentList={currentData}
          //   getAppointments={getAppointments}
        />

        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={appointmentList?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
