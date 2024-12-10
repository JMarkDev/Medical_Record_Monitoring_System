import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastProvider } from "./hooks/useToast.jsx";
// import { AuthProvider } from "./AuthContext/AuthContext.jsx";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import { fetchUser } from "./services/authSlice.js";
import { fetchAllPatients } from "./services/patientSlice.js";
import Cookie from "js-cookie";

const token = Cookie.get("accessToken");

if (token) {
  store.dispatch(fetchAllPatients());
  store.dispatch(fetchUser());
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* <AuthProvider> */}
    <Router>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Router>
    {/* </AuthProvider> */}
  </Provider>

  // </React.StrictMode>
);
