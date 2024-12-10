import PropTypes from "prop-types";

const SuccessAppointment = ({ openModal, closeSuccessModal, doctor }) => {
  return (
    <div
      aria-hidden={!openModal}
      className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${
        openModal
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        role="dialog"
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
        className="relative w-full z-50 max-w-md p-8 bg-white rounded-lg shadow-lg text-center"
      >
        {/* Close Button */}
        <button
          onClick={closeSuccessModal}
          type="button"
          className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none rounded-full p-2"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <svg
            className="mx-auto w-16 h-16 text-green-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 10.5l3 3 5-5"
            />
          </svg>
        </div>

        {/* Modal Content */}
        <h2
          id="update-modal-title"
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Appointment Successful!
        </h2>
        <p id="update-modal-description" className="mb-4 text-gray-600 text-sm">
          Your appointment with{" "}
          <span className="font-semibold">Dr. {doctor}</span> has been
          successfully scheduled. We look forward to seeing you soon!
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Action Button */}
        <button
          onClick={closeSuccessModal}
          type="button"
          className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5"
        >
          Close
        </button>
      </div>
    </div>
  );
};

SuccessAppointment.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeSuccessModal: PropTypes.func.isRequired,
  doctor: PropTypes.string.isRequired,
};

export default SuccessAppointment;
