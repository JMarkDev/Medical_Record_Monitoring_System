import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import NavbarDashboard from "../navbar/NavbarDashboard";
import PropTypes from "prop-types";

const LayoutDashboard = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);
  const handleBurger = () => {
    setSidebar(!sidebar);
  };
  return (
    <div className="flex min-h-screen ">
      <div className="">
        <Sidebar sidebar={sidebar} handleBurger={handleBurger} />
      </div>
      <div className="flex flex-col flex-grow">
        <NavbarDashboard handleBurger={handleBurger} sidebar={sidebar} />
      </div>
      {/* <div className="flex-grow bg-white w-full p-4 mt-20 mx-2 overflow-hidden">
        {children}
      </div> */}
      <div
        className={`flex-grow bg-white w-full p-4 mt-20 mx-2 ${
          location.pathname.includes("/document/details")
            ? ""
            : "overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

LayoutDashboard.propTypes = {
  children: PropTypes.node,
};
export default LayoutDashboard;
