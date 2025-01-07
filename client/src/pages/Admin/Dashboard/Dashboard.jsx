import { useEffect, useState } from "react";
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
const socket = io.connect(`${api.defaults.baseURL}`);

const SlaughterDashboard = () => {
  const dispatch = useDispatch();
  const patients = useSelector(getAllPatients);
  const { dateFormat } = useFormat();
  const [appointmentList, setAppointmentList] = useState([]);
  const [userList, setUserList] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await api.get("/users/all-user");
      setUserList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAppointments = async () => {
    try {
      const response = await api.get("/appointment/get-all");
      setAppointmentList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchAllPatients("all"));
    getAllAppointments();
    getAllUsers();
  }, [dispatch]);

  useEffect(() => {
    socket.on("success_add_patient", (data) => {
      dispatch(fetchAllPatients("all"));
    });

    socket.on("success_update", (data) => {
      dispatch(fetchAllPatients("all"));
    });

    socket.on("success_appointment", (data) => {
      getAllAppointments();
    });

    socket.on("success_medication", (data) => {
      dispatch(fetchAllPatients("all"));
    });

    return () => {
      socket.off("success_add_patient");
      socket.off("success_update");
      socket.off("success_appointment");
      socket.off("success_medication");
    };
  }, [dispatch]);

  const dateFormatted = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const todaysPatients = patients?.filter(
    (patient) => dateFormatted(patient.createdAt) === dateFormatted(new Date())
  );

  const cardData = [
    { title: "Total Patients", value: patients?.length },
    {
      title: "New Patients (Today)",
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
    {
      title: "Total Doctors",
      value: userList?.filter((user) => user.role === rolesList.doctor).length,
    },
    {
      title: "Total Nurses",
      value: userList?.filter((user) => user.role === rolesList.nurse).length,
    },
    // { title: "Total Appointments", value: appointmentList?.length },
    // {
    //   title: "Completed Appointments",
    //   value: appointmentList?.filter(
    //     (appointment) => appointment.status === "Completed"
    //   ).length,
    // },
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
