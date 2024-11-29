import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

// Create a new context
const ToastContext = createContext();

// Create a custom hook to use the context
export const useToast = () => {
  return useContext(ToastContext);
};

// Provider component to wrap your application
export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={toast}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};

export const toastUtils = () => {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
  };
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
