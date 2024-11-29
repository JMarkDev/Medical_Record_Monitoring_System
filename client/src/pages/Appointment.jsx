import { useState } from "react";
import profileImg from "../assets/images/medical_records.jpeg";
import Navbar from "../components/navbar/Navbar";

const Appointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    contactNumber: "",
    symptoms: "",
    preferredDate: "",
  });

  const doctors = [
    {
      id: 1,
      name: "Dr. John Doe",
      specialization: "Cardiologist",
      availability: "Monday - Friday, 9 AM - 4 PM",
      image: profileImg,
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      specialization: "Dermatologist",
      availability: "Tuesday - Saturday, 10 AM - 3 PM",
      image: profileImg,
    },
    {
      id: 3,
      name: "Dr. Emily White",
      specialization: "Pediatrician",
      availability: "Monday - Thursday, 8 AM - 2 PM",
      image: profileImg,
    },
  ];

  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmission = () => {
    if (
      !selectedDoctor ||
      !patientDetails.fullName ||
      !patientDetails.contactNumber
    ) {
      alert("Please complete all required fields.");
      return;
    }
    alert(
      `Appointment booked with ${selectedDoctor.name} for patient ${patientDetails.fullName}.`
    );
  };

  return (
    <div className="min-h-screen  relative w-full flex items-center flex-col  bg-gray-50">
      <Navbar />
      <div className=" bg-gray-50 mt-10 w-full md:px-20 px-5 flex flex-col items-center ">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Book an Appointment
        </h1>
        <h1 className="my-5 text-xl text-gray-700 font-semibold">
          Select a Doctor
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`p-6 bg-white rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition ${
                selectedDoctor?.id === doctor.id
                  ? "border-2 border-blue-500"
                  : ""
              }`}
              onClick={() => handleDoctorSelection(doctor)}
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500 mt-2">
                {doctor.availability}
              </p>
            </div>
          ))}
        </div>

        {selectedDoctor && (
          <div className="mt-8 w-full max-w-xl shadow-lg bg-white p-6 rounded-lg h-full ">
            <h3 className="text-xl font-semibold text-gray-800">
              Selected Doctor: {selectedDoctor.name}
            </h3>
            <p className="text-gray-600">{selectedDoctor.specialization}</p>
            <p className="text-sm text-gray-500">
              {selectedDoctor.availability}
            </p>

            <form className="mt-6 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={patientDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="number"
                  name="contactNumber"
                  value={patientDetails.contactNumber}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Enter your contact number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symptoms
                </label>
                <textarea
                  name="symptoms"
                  value={patientDetails.symptoms}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Describe your symptoms"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={patientDetails.preferredDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                />
              </div>

              <button
                type="button"
                onClick={handleAppointmentSubmission}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md shadow-md border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
