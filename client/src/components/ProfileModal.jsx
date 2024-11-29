import PropTypes from "prop-types";
import api from "../api/axios";
import userIcon from "../assets/images/user (1).png";

const ProfileModal = ({ modal, closeModal, data }) => {
  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden={!modal}
        onClick={() => closeModal(false)}
        className="fixed inset-0 z-[40] px-5 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-20 font-normal"
      >
        {" "}
        <div className="relative">
          <div className="relative text-gray-800 bg-white rounded-xl shadow-lg ">
            <div className="flex items-center justify-center rounded-t">
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => closeModal(false)}
              >
                <svg
                  className="w-3 h-3"
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
              </button>
            </div>
            <div>
              <img
                src={`${data ? `${api.defaults.baseURL}${data}` : userIcon}`}
                alt=""
                className="h-52 w-52"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ProfileModal.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
  data: PropTypes.string,
};

export default ProfileModal;
