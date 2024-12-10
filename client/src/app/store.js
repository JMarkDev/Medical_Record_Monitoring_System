import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";
import usersReducer from "../services/usersSlice";
import notificationReducer from "../services/notificationSlice";
import animalReducer from "../services/animalsSlice";
import patientReducer from "../services/patientSlice";
import prescriptionReducer from "../services/prescriptionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notification: notificationReducer,
    animals: animalReducer,
    patients: patientReducer,
    prescriptions: prescriptionReducer,
  },
});
