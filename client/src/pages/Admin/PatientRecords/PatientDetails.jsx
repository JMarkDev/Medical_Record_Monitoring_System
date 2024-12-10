import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchPatientById,
  getPatientById,
} from "../../../services/patientSlice";
import { useFormat } from "../../../hooks/useFormatDate";

const PatientDetails = () => {
  const { dateFormat } = useFormat();
  const { id } = useParams();
  const dispatch = useDispatch();
  const patient = useSelector(getPatientById);

  useEffect(() => {
    dispatch(fetchPatientById(id));
  }, [dispatch, id]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  // Conditionally parse prescriptions and other nested objects if they are JSON strings
  const prescriptions = Array.isArray(patient.Prescriptions)
    ? patient.Prescriptions
    : JSON.parse(patient.Prescriptions || "[]");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">
          {patient.firstName} {patient.lastName}
        </h1>
        <p className="text-lg mt-4">
          <span className="font-semibold">Date of Birth:</span>{" "}
          {new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Gender:</span> {patient.gender}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Status:</span> {patient.status}
        </p>
      </div>

      {/* Contact and Insurance Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            Contact Information
          </h2>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Contact Number:</span>{" "}
            {patient.contactNumber}
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Address:</span> {patient.address}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            Insurance Information
          </h2>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Insurance ID:</span>{" "}
            {patient.patient_insurance_id}
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Insurance Provider:</span>{" "}
            {patient.patient_insurance_provider}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">Diagnoses</h2>
        {patient?.Diagnoses && patient?.Diagnoses.length > 0 ? (
          <ul className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full  gap-5">
            {patient?.Diagnoses.map((diagnosis) => (
              <li
                key={diagnosis.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <p className="text-lg">
                  <span className="font-semibold">Diagnosis:</span>{" "}
                  {diagnosis.diagnosisName}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Details:</span>{" "}
                  {diagnosis.details}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Doctor:</span>{" "}
                  {diagnosis.doctorName}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(diagnosis.diagnosisDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Notes:</span>{" "}
                  {diagnosis.notes}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No diagnoses available.</p>
        )}
      </div>

      {/* Medications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">Medications</h2>
        {patient?.Medications && patient?.Medications.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {patient?.Medications.map((medication) => (
              <li
                key={medication.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <p className="text-lg">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(medication.medicationDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {medication.transcription}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Doctor Name:</span>{" "}
                  {medication.doctorName}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-md ${
                      medication.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {medication.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No medications available.</p>
        )}
      </div>
      {/* Lab Results */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">Lab Results</h2>
        {patient?.lab_results && patient?.lab_results.length > 0 ? (
          <ul className="mt-4 space-y-2 text-gray-600">
            {patient.lab_results.map((result, index) => {
              // Parse files if it's a JSON string
              let files = result.files;
              if (typeof files === "string") {
                try {
                  files = JSON.parse(files);
                } catch (error) {
                  console.error("Failed to parse files:", error);
                  files = [];
                }
              }

              return (
                <li key={index} className="space-y-2 p-4 bg-gray-50 rounded">
                  <p>
                    <span className="font-semibold">Test Name:</span>{" "}
                    {result.testName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Doctor:</span>{" "}
                    {result.doctorName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {result.description || "N/A"}
                  </p>
                  {files && files.length > 0 && (
                    <div>
                      <span className="font-semibold">Files:</span>
                      <div className="flex space-x-2 mt-2">
                        {files.map((file, fileIndex) => (
                          <a
                            key={fileIndex}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View File {fileIndex + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No lab results available.</p>
        )}
      </div>

      {/* Vital Signs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">
          Clinical Observations
        </h2>
        {patient?.vitals && patient?.vitals.length > 0 ? (
          <ul className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full  gap-5">
            {patient?.vitals.map((vital, index) => (
              <li
                key={index}
                className="border p-4 text-sm rounded-lg  text-gray-700 bg-gray-50 shadow-sm"
              >
                <p>
                  <span className="font-semibold">Blood Pressure:</span>{" "}
                  {vital.bloodPressure}
                </p>
                <p>
                  <span className="font-semibold">Body Temperature:</span>{" "}
                  {vital.bodyTemperature}°C
                </p>
                <p>
                  <span className="font-semibold">Heart Rate:</span>{" "}
                  {vital.heartRate} BPM
                </p>
                <p>
                  <span className="font-semibold">Nurse:</span>{" "}
                  {vital.nurseName}
                </p>
                <p>
                  <span className="font-semibold">Date and Time:</span>{" "}
                  {dateFormat(vital.measurementTime)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No vital clinical observations.</p>
        )}
      </div>

      {/* bladder_bowel_diaries
       */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">
          Bladder and Bowel Diaries
        </h2>
        {patient?.bladder_bowel_diaries &&
        patient?.bladder_bowel_diaries.length > 0 ? (
          <ul className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full  gap-5">
            {patient?.bladder_bowel_diaries.map((diary, index) => (
              <li
                key={index}
                className="border p-4 text-sm rounded-lg text-gray-700 bg-gray-50 shadow-sm"
              >
                <p>
                  <span className="font-semibold">Water Intake:</span>{" "}
                  {diary.waterIntake} times/day
                </p>
                <p>
                  <span className="font-semibold">Urine Volume:</span>{" "}
                  {diary.urineVolume} ml
                </p>
                <p>
                  <span className="font-semibold">Void Frequency:</span>{" "}
                  {diary.voidFrequency} times/day
                </p>
                <p>
                  <span className="font-semibold">Urinary Symptoms:</span>{" "}
                  {diary.urinarySymptoms}
                </p>
                <p>
                  <span className="font-semibold">Stool Frequency:</span>{" "}
                  {diary.stoolFrequency} times/day
                </p>
                <p>
                  <span className="font-semibold">Stool Consistency:</span>{" "}
                  {diary.stoolConsistency}
                </p>
                <p>
                  <span className="font-semibold">Bowel Symptoms:</span>{" "}
                  {diary.bowelSymptoms}
                </p>
                <p>
                  <span className="font-semibold">Nurse:</span>{" "}
                  {diary.nurseName}
                </p>
                <p>
                  <span className="font-semibold">Additional Notes:</span>{" "}
                  {diary.notes}
                </p>
                <p>
                  <span className="font-semibold">Date and Time:</span>{" "}
                  {new Date(diary.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">
            No bladder and bowel diary records available.
          </p>
        )}
      </div>

      {/* Prescriptions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">Prescriptions</h2>
        {prescriptions?.length > 0 ? (
          <ul className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full  gap-5">
            {prescriptions?.map((prescription) => (
              <li
                key={prescription.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <p className="text-lg">
                  <span className="font-semibold">Diagnosis:</span>{" "}
                  {prescription.diagnosis}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Doctor:</span>{" "}
                  {prescription.doctorName}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Instructions:</span>{" "}
                  {prescription.instructions}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-md ${
                      prescription.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {prescription.status}
                  </span>
                </p>
                {prescription?.medicine &&
                  prescription?.medicine?.length > 0 && (
                    <div className="mt-2 ">
                      <h3 className="font-semibold">Medicines:</h3>
                      <ul className="mt-2 space-y-2">
                        {prescription?.Medicine?.map((med, index) => (
                          <li
                            key={index}
                            className="text-gray-600 bg-gray-100 p-2 rounded-md"
                          >
                            <p>
                              <span className="font-semibold">Name:</span>{" "}
                              {med.name}
                            </p>
                            <p>
                              <span className="font-semibold">Dosage:</span>{" "}
                              {med.dosage}
                            </p>
                            <p>
                              <span className="font-semibold">Frequency:</span>{" "}
                              {med.frequency}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No prescriptions available.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
