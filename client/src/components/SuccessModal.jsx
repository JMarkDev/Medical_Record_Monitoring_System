import PropTypes from "prop-types";

const UpdateModal = ({ openModal, setOpenModal, status }) => {
  // Dynamic styles based on the status
  const statusStyles = {
    Scheduled: {
      iconColor: "text-blue-500",
      title: "Scheduled Successfully!",
      bgColor: "bg-blue-100",
      icon: (
        <svg
          className="mx-auto mb-4 w-16 h-16 text-blue-500"
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
      ),
      buttonColor: "bg-blue-500",
    },
    Cancelled: {
      iconColor: "text-red-500",
      title: "Action Cancelled!",
      bgColor: "bg-red-100",
      icon: (
        <svg
          className="mx-auto mb-4 w-16 h-16 text-red-500"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      buttonColor: "bg-red-500",
    },
    Completed: {
      iconColor: "text-green-500",
      title: "Completed Successfully!",
      bgColor: "bg-green-100",
      icon: (
        <svg
          className="mx-auto mb-4 w-16 h-16 text-green-500"
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
      ),
      buttonColor: "bg-green-500",
    },
  };

  const { iconColor, title, bgColor, icon, buttonColor } = statusStyles[
    status
  ] || {
    iconColor: "text-gray-500",
    title: "Action Processed",
    bgColor: "bg-gray-100",
    icon: (
      <svg
        className="mx-auto mb-4 w-16 h-16 text-gray-500"
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
    ),
    buttonColor: "bg-gray-500",
  };

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
        className={`relative w-full max-w-md mx-5 p-8 ${bgColor} rounded-lg shadow-lg text-center`}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpenModal(false)}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none rounded-full p-2"
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

        {/* Dynamic Icon */}
        {icon}

        {/* Modal Content */}
        <h2 id="update-modal-title" className="text-lg font-bold text-gray-800">
          {status} Appointment
        </h2>
        <p id="update-modal-description" className="mb-4 text-sm text-gray-600">
          Status: {status}
        </p>

        {/* Action Button */}
        <button
          onClick={() => setOpenModal(false)}
          type="button"
          className={`text-white ${buttonColor} hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-${
            buttonColor.split("-")[1]
          }-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

UpdateModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

export default UpdateModal;
