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
import Transaction from "./pages/Admin/Transaction/Transaction";
import Cattle from "./pages/Admin/AnimalRecords/Cattle/Cattle";
import Pigs from "./pages/Admin/AnimalRecords/Pigs/Pigs";
import Goats from "./pages/Admin/AnimalRecords/Goats/Goats";

import CityAdmin from "./pages/Admin/UserManagement/CityAdmin/CityAdmin";
import SlaughterhouseUser from "./pages/Admin/UserManagement/Slaughterhouse/SlaughterhouseUsers";
import SlaughterhouseRecords from "./pages/Admin/SlaughterhouseRecords/SlaughterhouseRecords";
import Records from "./pages/Admin/SlaughterhouseRecords/Records";
import SlaughterTransaction from "./pages/SlaughterHouse/Transaction/SlaughterTransaction";
import Reports from "./pages/Admin/Reports/Reports";
import TransactionDetails from "./pages/Shared/TransactionDetails";
import AnimalRecords from "./pages/SlaughterHouse/AnimalRecords/AnimalRecords";
import SlaughterHouseReport from "./pages/SlaughterHouse/Reports/SlaughterReports";
import SlaughterDashboard from "./pages/SlaughterHouse/Dashboard/SlaughterDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Appointment from "./pages/Appointment";

function App() {
  const adminLinks = [
    { title: "Dashboard", path: "/admin-dashboard", component: <Dashboard /> },
    {
      title: "Slaughterhouse",
      path: "/slaughterhouse-records",
      component: <SlaughterhouseRecords />,
    },
    {
      title: "Records",
      path: "/slaughterhouse-records/:id",
      component: <Records />,
    },
    { title: "Transaction", path: "/transaction", component: <Transaction /> },
    { title: "Cattle", path: "/cattle", component: <Cattle /> },
    { title: "Pigs", path: "/pigs", component: <Pigs /> },
    { title: "Goats", path: "/goats", component: <Goats /> },
    { title: "City Admin", path: "/admin", component: <CityAdmin /> },
    {
      title: "Slaughterhouse User",
      path: "/supervisor",
      component: <SlaughterhouseUser />,
    },
    { title: "Reports", path: "/reports", component: <Reports /> },
  ];

  // const slaughterhouseLinks = [
  //   {
  //     title: "Dashboard",
  //     path: "/slaughterhouse-dashboard",
  //     component: <SlaughterDashboard />,
  //   },
  //   {
  //     title: "Transaction",
  //     path: "/slaughterhouse-transaction",
  //     component: <SlaughterTransaction />,
  //   },
  //   {
  //     title: "Animal Records",
  //     path: "/animal-records",
  //     component: <AnimalRecords />,
  //   },
  //   {
  //     title: "Reports",
  //     path: "/slaughterhouse-reports",
  //     component: <SlaughterHouseReport />,
  //   },
  // ];

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
      title: "Transaction",
      path: "/transaction/:id",
      component: <TransactionDetails />,
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

        {/* {slaughterhouseLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.supervisor]}
              />
            }
          />
        ))} */}

        {sharedLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.admin, rolesList.supervisor]}
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
