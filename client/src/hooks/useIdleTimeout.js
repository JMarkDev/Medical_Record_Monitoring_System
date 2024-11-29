import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../services/authSlice"; // Adjust the path to your authSlice

const useIdleTimeout = (timeout = 1800000) => {
  // 30 minutes = 1800000 ms
  const dispatch = useDispatch();
  const timeoutId = useRef(null);
  console.log(timeoutId);

  const resetTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      // Log the user out after the timeout
      dispatch(logoutUser());
    }, timeout);
  };

  useEffect(() => {
    // List of events that reset the timeout
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Reset the timeout when an event occurs
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    // Start the timeout initially
    resetTimeout();

    // Cleanup event listeners on component unmount
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default useIdleTimeout;
