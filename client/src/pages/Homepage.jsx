import NavBar from "../components/navbar/Navbar";
import landingImg from "../assets/images/medical_records.jpeg";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <div className="h-screen max-h-min relative w-full flex flex-col bg-gray-50">
        <NavBar />

        <div className="body my-6 p-5 items-center gap-6 lg:flex md:px-16 w-full h-5/6">
          <div className="w-full flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
            <h1 className="text-5xl font-extrabold text-gray-800 leading-snug tracking-tight">
              Streamline Your{" "}
              <span className="text-primary">HealthCare Records</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Simplify managing medical records, booking appointments, and
              enhancing care coordination — all in one seamless platform
              designed for patients and providers alike.
            </p>
            <Link
              to={"/register"}
              className="rounded-full px-6 py-1.5 text-lg font-medium border-primary border-2 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-md"
            >
              {/* Book Appointment */}
              Register
            </Link>
          </div>

          <div className="relative lg:w-1/2 lg:my-auto">
            <img
              src={landingImg}
              alt="Graphics"
              className="shadow-lg rounded-lg lg:mx-auto mt-6 lg:mt-0 transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-200 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
