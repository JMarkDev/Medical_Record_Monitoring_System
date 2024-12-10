import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoSearch } from "react-icons/io5";
import {
  getFilterPatients,
  filterPatients,
} from "../../../services/patientSlice";
import { useFormat } from "../../../hooks/useFormatDate";
import LineChartDocumentSubmissions from "../../../components/charts/LineChart";

const Reports = () => {
  const dispatch = useDispatch();
  const { dateFormat } = useFormat();
  const patients = useSelector(getFilterPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(null);
  const [gender, setGender] = useState("");

  useEffect(() => {
    dispatch(
      filterPatients({
        startDate: startDate,
        endDate: endDate,
        gender: gender,
        status: status,
        patientName: searchTerm,
      })
    );
  }, [startDate, endDate, gender, status, searchTerm, dispatch]);

  const downloadCsv = () => {
    const headers = [
      "Patient Name",
      "Date of Birth",
      "Gender",
      "Contact Number",
      "Address",
      // "Insurance ID",
      // "Insurance Provider",
      "Status",
      "Created At",
    ];

    const formatFieldCsv = (field) => {
      if (/[,]/.test(field)) {
        return `"${field}"`;
      }
      return field;
    };

    const dataRows = patients?.map((patient) => {
      return [
        formatFieldCsv(`${patient.firstName} ${patient.lastName}`), // Patient Name
        formatFieldCsv(dateFormat(patient.dateOfBirth)), // Date of Birth
        formatFieldCsv(patient.gender), // Gender
        formatFieldCsv(patient.contactNumber), // Contact Number
        formatFieldCsv(patient.address), // Address
        // formatFieldCsv(patient.patient_insurance_id), // Insurance ID
        // formatFieldCsv(patient.patient_insurance_provider), // Insurance Provider
        formatFieldCsv(patient.status), // Status
        formatFieldCsv(dateFormat(patient.createdAt)), // Created At
      ];
    });

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    const csvWithBom = "\uFEFF" + csvContent;

    const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Patient_Reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        <div className="">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-blue-500 block w-full text-sm text-gray-900 bg-transparent rounded-lg"
          />
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2">
            Start Date
          </label>
        </div>
        <div className="">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-blue-500 block w-full text-sm text-gray-900 bg-transparent rounded-lg"
          />
          <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2">
            End Date
          </label>
        </div>
        <div className="">
          <select
            value={gender || ""}
            onChange={(e) => setGender(e.target.value)}
            className="border-blue-500 block w-full text-sm text-gray-900 bg-transparent rounded-lg"
          >
            <option value="">Filter by patient gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="">
          <select
            value={status || ""}
            onChange={(e) => setStatus(e.target.value)}
            className="border-blue-500 block w-full text-sm text-gray-900 bg-transparent rounded-lg"
          >
            <option value="">Filter by patient status</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex justify-between items-center">
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
          onClick={downloadCsv}
          className="bg-blue-600 text-white rounded-lg py-2 px-4 "
        >
          Download Reports
        </button>
      </div>

      <div className="mt-5">
        <table className="min-w-full table-auto  text-sm border-collapse">
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center  whitespace-nowrap">
                  FULL NAME
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center  whitespace-nowrap">
                  CONTACT NUMBER
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center  whitespace-nowrap">
                  ADDRESS
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center  whitespace-nowrap">
                  DATE OF BIRTH
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center  whitespace-nowrap">
                  GENDER
                </div>
              </th>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center  whitespace-nowrap">
                  STATUS
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {patients?.map((patient) => (
              <tr key={patient.id}>
                <td className="px-4 py-4 whitespace-nowrap">{`${patient.firstName} ${patient.lastName}`}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {patient.contactNumber}
                </td>
                <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                  {patient.address}
                </td>
                <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                  {patient.dateOfBirth}
                </td>
                <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                  {patient.gender}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs`}
                >
                  <span
                    className={`p-2 rounded-lg text-white ${
                      patient.status === "Admitted"
                        ? "bg-green-400"
                        : status === "Transferred"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h1 className="font-bold mb-5">Transaction Chart</h1>
        <LineChartDocumentSubmissions data={patients} />
      </div>
    </div>
  );
};

export default Reports;
