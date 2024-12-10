import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormat } from "../../../hooks/useFormatDate";
import LineChartDocumentSubmissions from "../../../components/charts/LineChart";
import DonutChart from "../../../components/charts/DonutChart";
import PatientStatusChart from "../../../components/charts/PatientStatusChart";
import Cards from "../../../components/Cards";
import io from "socket.io-client";
import api from "../../../api/axios";
import {
  fetchAllPatients,
  getAllPatients,
} from "../../../services/patientSlice";
import rolesList from "../../../constants/rolesList";
import { getUserData } from "../../../services/authSlice";
const socket = io.connect(`${api.defaults.baseURL}`);

const SlaughterDashboard = () => {
  const dispatch = useDispatch();
  const patients = useSelector(getAllPatients);
  const user = useSelector(getUserData);
  const [appointmentList, setAppointmentList] = useState([]);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await api.get(
          `/appointment/get-appointment/${user?.id}`
        );
        setAppointmentList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAppointments();
  }, [user]);

  useEffect(() => {
    dispatch(fetchAllPatients("all"));
  }, [dispatch]);

  const dateFormatted = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const todaysPatients = appointmentList?.filter(
    (patient) => dateFormatted(patient.createdAt) === dateFormatted(new Date())
  );

  const cardData = [
    // { title: "Total Patients", value: patients?.length },
    { title: "Total Appointments", value: appointmentList?.length },
    {
      title: "New Appointment (Today)",
      value: todaysPatients.length,
    },

    {
      title: "Admitted Patients",
      value: patients?.filter((patient) => patient.status === "Admitted")
        .length,
    },
    {
      title: "Discharged Patients",
      value: patients?.filter((patient) => patient.status === "Discharged")
        .length,
    },
  ];

  return (
    <div className="w-full">
      <div className=" flex flex-wrap">
        <Cards data={cardData} />
      </div>
      <div className="mt-10">
        <h1 className="font-bold bg-gray-300 text-gray-700 mb-5 p-2">
          Patients Submission Trend
        </h1>
        <LineChartDocumentSubmissions data={patients} />
      </div>

      {/* Bar Chart */}
      <div className="mt-10 flex xl:flex-row flex-col gap-3 items-center">
        <div className="shadow-xl  w-full rounded-lg p-2">
          <h1 className="font-bold bg-gray-300 text-gray-700 mb-5 p-2">
            Patient Admission and Discharge Status
          </h1>
          <PatientStatusChart data={patients} />
        </div>

        <div className="shadow-xl w-full rounded-lg p-2">
          <h1 className="font-bold bg-gray-300 text-gray-700 mb-5 p-2">
            Patient Gender Distribution
          </h1>
          <DonutChart data={patients} />
        </div>
      </div>
    </div>
  );
};

export default SlaughterDashboard;
