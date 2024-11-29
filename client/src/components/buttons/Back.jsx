import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <button
      onClick={() => navigate(-1)} // Navigate back to the previous page
      className="bg-gray-500 md:text-lg text-sm hover:bg-gray-600 flex items-center gap-2 rounded-lg px-4 py-2 text-white"
    >
      <IoMdArrowRoundBack />
      Back
    </button>
  );
};

export default BackButton;
