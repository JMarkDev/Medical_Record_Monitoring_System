import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SuccessModal = ({ successModal, closeSuccessModal, id }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        id="success-modal"
        tabIndex="-1"
        aria-hidden={!successModal}
        className={`fixed inset-0 z-50 px-5 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 transition-opacity duration-300 ease-out ${
          successModal ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 transform scale-100">
            <button
              onClick={closeSuccessModal}
              type="button"
              className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>

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

            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              New Animal Added!
            </h3>
            <p className="mb-4 text-gray-500">
              You have successfully added a new animal transaction
            </p>

            <button
              onClick={() => navigate(`/transaction/${id}`)}
              type="button"
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              View Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  successModal: PropTypes.bool.isRequired,
  closeSuccessModal: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default SuccessModal;
