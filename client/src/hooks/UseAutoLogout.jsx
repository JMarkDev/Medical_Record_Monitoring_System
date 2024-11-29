import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../services/authSlice";

export const UseAutoLogout = () => {
  const dispatch = useDispatch();
  const inactivityTimer = useRef(null);
  const INACTIVITY_LIMIT = 30 * 60 * 1000;

  const resetTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      dispatch(logoutUser());
    }, INACTIVITY_LIMIT);
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    resetTimer();
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      clearTimeout(inactivityTimer.current);
    };
  }, []);

  return null;
};

// export default useAutoLogout;
