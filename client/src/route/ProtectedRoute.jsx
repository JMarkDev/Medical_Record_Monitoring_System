import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, getUserData, getLoading } from "../services/authSlice";
import LoginLoading from "../components/loader/loginloader/LoginLoading";
import { useEffect } from "react";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const userData = useSelector(getUserData);
  const loading = useSelector(getLoading);

  if (loading) {
    return (
      <div>
        <LoginLoading />
      </div>
    ); // Show loading state while fetching user
  }

  if (!userData) {
    // if user is not authenticated, redirect to home
    return <Navigate to="/home" replace />;
  }

  // if user is authenticated but not authorzed
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // if user is authenticated and authorized, render the element
  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
  allowedRoles: PropTypes.node.isRequired,
};

export default ProtectedRoute;
