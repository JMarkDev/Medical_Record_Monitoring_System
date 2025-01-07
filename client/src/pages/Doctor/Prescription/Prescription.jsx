// const Prescription = () => {
//   return <div>Prescription</div>;
// };

// export default Prescription;
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";
import PrescriptionTable from "../../../components/table/PrescriptionTable";
import {
  getAllPatients,
  fetchAllPatients,
  reset,
} from "../../../services/patientSlice";
import AddPrescription from "./AddPrescription";
import {
  getPrescriptions,
  fetchPrescriptionsByStatus,
  searchPrescription,
} from "../../../services/prescriptionSlice";
import { getUserData } from "../../../services/authSlice";

const PatientRecords = () => {
  const dispatch = useDispatch();
  const prescriptions = useSelector(getPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const patients = useSelector(getAllPatients);
  const [status, setStatus] = useState("Admitted");
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  // const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const user = useSelector(getUserData);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    dispatch(reset());
    setDoctorId(user?.id);
  }, [dispatch, user]);

  // useEffect(() => {
  //   const filterPatient = patients?.filter((patient) => {
  //     return patient?.doctorId?.includes(doctorId);
  //   });
  //   setFilteredPatients(filterPatient);
  // }, [patients, doctorId]);

  useEffect(() => {
    const filterPrescription = prescriptions?.filter((prescription) => {
      return prescription?.doctorId === doctorId;
    });

    setFilteredPrescriptions(filterPrescription);
  }, [prescriptions, doctorId]);

  useEffect(() => {
    if (status) {
      dispatch(fetchAllPatients(status));
    }

    dispatch(fetchPrescriptionsByStatus("all"));
  }, [dispatch, status]);

  const fetchUpdate = () => {
    dispatch(fetchPrescriptionsByStatus("all"));
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchPrescription({ search: searchTerm }));
    } else {
      dispatch(fetchPrescriptionsByStatus("all"));
    }
  }, [searchTerm, dispatch, status]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  // const currentData = filteredPatients?.slice(
  //   indexOfFirstDocument,
  //   indexOfLastDocument
  // );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddPrescription = () => {
    setShowAddPrescription(true);
  };

  const closeAddPrescription = () => {
    setShowAddPrescription(false);
  };

  return (
    <div>
      <div className="flex text-sm md:text-[16px] justify-between  lg:flex-row flex-col gap-5">
        <button
          onClick={openAddPrescription}
          className="w-fit p-2 px-6 rounded-lg bg-primary hover:bg-primary text-white font-semi"
        >
          Add Prescription
        </button>
        {showAddPrescription && (
          <AddPrescription
            onClose={closeAddPrescription}
            fetchUpdate={fetchUpdate}
            isOpen={showAddPrescription}
          />
        )}
        <div className=" flex max-w-[450px] w-full items-center relative">
          <input
            type="text"
            placeholder="Search by patient name, diagnosis, or doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-blue-500 focus:border-blue  rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <IoSearch className="text-2xl absolute right-2 text-gray-600" />
        </div>
      </div>
      <div className="mt-8">
        {/* <UserTable users={currentData} fetchUpdate={fetchUpdate} /> */}
        <PrescriptionTable
          // patients={currentData}
          fetchUpdate={fetchUpdate}
          prescriptions={filteredPrescriptions}
        />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={filteredPrescriptions?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
