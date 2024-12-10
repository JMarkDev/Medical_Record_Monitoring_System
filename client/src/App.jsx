import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import rolesList from "./constants/rolesList";

import ProtectedRoute from "./route/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

import UserProfile from "./pages/Shared/UserProfile";
import UserDetails from "./pages/Shared/UserDetails";

import Homepage from "./pages/Homepage";
import LayoutDashboard from "./components/layout/LayoutDashboard";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import PatientRecords from "./pages/Admin/PatientRecords/PatientRecords";

import Admin from "./pages/Admin/UserManagement/Admin/Admin";
import Reports from "./pages/Admin/Reports/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Appointment from "./pages/Appointment";
import Nurse from "./pages/Admin/UserManagement/Nurse/Nurse";
import Doctor from "./pages/Admin/UserManagement/Doctor/Doctor";
import PatientDetails from "./pages/Admin/PatientRecords/PatientDetails";
import Archive from "./pages/Admin/Archive/Archive";
import AppointmentAdmin from "./pages/Admin/AppointMent/Appointment";

import TaskAssign from "./pages/Nurse/TaskAssign/TaskAssign";
import NurseMedication from "./pages/Nurse/Medication/Medication";
import NurseDashboard from "./pages/Nurse/Dashboard/Dashboard";
import NurseReports from "./pages/Nurse/Reports/Reports";
import NursePatientRecords from "./pages/Nurse/PatientRecords/PatientRecords";

import DoctorDashboard from "./pages/Doctor/Dashboard/Dashboard";
import DoctorAppointment from "./pages/Doctor/Appointment/Appointment";
import DoctorPrescription from "./pages/Doctor/Prescription/Prescription";
import DoctorPatientRecords from "./pages/Doctor/PatientRecords/PatientRecords";
import DoctorReports from "./pages/Doctor/Reports/Reports";

function App() {
  const adminLinks = [
    { title: "Dashboard", path: "/admin-dashboard", component: <Dashboard /> },
    {
      title: "Patient Records",
      path: "/patient-records",
      component: <PatientRecords />,
    },
    {
      title: "Appointments",
      path: "/admin-appointments",
      component: <AppointmentAdmin />,
    },
    { title: "Admin", path: "/admin", component: <Admin /> },
    { title: "Nurse", path: "/nurse", component: <Nurse /> },
    { title: "Doctor", path: "/doctor", component: <Doctor /> },
    { title: "Reports", path: "/reports", component: <Reports /> },
    { title: "Archive", path: "/archive", component: <Archive /> },
  ];

  const nurseLinks = [
    {
      title: "Dashboard",
      path: "/nurse-dashboard",
      component: <NurseDashboard />,
    },
    {
      title: "Patient Records",
      path: "/nurse/patient-records",
      component: <NursePatientRecords />,
    },
    {
      title: "Task Assign",
      path: "/nurse/prescription",
      component: <TaskAssign />,
    },
    {
      title: "Medication",
      path: "/nurse/medication",
      component: <NurseMedication />,
    },
    { title: "Reports", path: "/nurse/reports", component: <NurseReports /> },
  ];

  const doctorLinks = [
    {
      title: "Dashboard",
      path: "/doctor-dashboard",
      component: <DoctorDashboard />,
    },
    {
      title: "Patient Records",
      path: "/doctor/patient-records",
      component: <DoctorPatientRecords />,
    },
    {
      title: "Appointment",
      path: "/doctor/appointment",
      component: <DoctorAppointment />,
    },
    {
      title: "Prescription",
      path: "/doctor/prescription",
      component: <DoctorPrescription />,
    },
    { title: "Reports", path: "/doctor/reports", component: <DoctorReports /> },
  ];

  const sharedLinks = [
    {
      title: "User Profile",
      path: "/user-profile",
      component: <UserProfile />,
    },
    {
      title: "User Details",
      path: "/user-details/:id",
      component: <UserDetails />,
    },
    {
      title: "Patient Details",
      path: "/patient-details/:id",
      component: <PatientDetails />,
    },
  ];

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/appointment" element={<Appointment />} />
        {/* <Route path="/voice-to-text" element={<VoiceToText />} /> */}
        {/* <Route path="/verify-otp" element={<VerifyOTP />} /> */}

        {adminLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.admin]}
              />
            }
          />
        ))}

        {nurseLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.nurse]}
              />
            }
          />
        ))}

        {doctorLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.doctor]}
              />
            }
          />
        ))}

        {sharedLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[
                  rolesList.admin,
                  rolesList.nurse,
                  rolesList.doctor,
                ]}
              />
            }
          />
        ))}

        {/* Not found page */}
        {/* <Route path="/scan-qr-code" element={<Scanner />} /> */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
