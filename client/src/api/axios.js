import axios from "axios";
import Cookie from "js-cookie";

// Create an instance of axios
const api = axios.create({
  // baseURL: "http://localhost:3001",
  baseURL: "https://healthcare-medical-record-server.tarakabataan.com",
  // baseURL: "https://zp77sd4z-3001.asse.devtunnels.ms",
  // baseURL: "http://192.168.1.9:3001", // use this when run in mobile phone or other device  check ipconfig in pc first
  withCredentials: true,
});
// const api = axios.create({
//   baseURL: "https://5079-122-54-34-194.ngrok-free.app", // Use ngrok's HTTPS URL
//   withCredentials: true,
// });
// Request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = Cookie.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/refresh", {});
        const newAccessToken = response.data.accessToken;
        console.log(response.data);

        // Store the new access token
        // localStorage.setItem("accessToken", newAccessToken);

        // Set the new access token in the axios instance
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log(err);
        // Handle token refresh errors (e.g., redirect to login)
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3001",
// });

// let refresh = false;
// api.interceptors.response.use(
//   (resp) => {
//     return resp;
//   },
//   async (error) => {
//     try {
//       if (error.response.status === 401 && !refresh) {
//         refresh = true;
//         const response = await api.post(
//           "/refresh",
//           {},
//           { withCredentials: true }
//         );

//         if (response.status === 200) {
//           api.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${response.data.accessToken}`;

//           return axios.request(error.config);
//         }
//       }
//     } catch (refreshError) {
//       // console.error("Token refresh failed", refreshError);
//     }

//     refresh = false;
//     return Promise.reject(error);
//   }
// );

// export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3001",
// });

// let refresh = false;

// api.interceptors.response.use(
//   (resp) => {
//     // Handle successful responses
//     console.log("Response received:", resp);
//     return resp;
//   },
//   async (error) => {
//     try {
//       console.log("Error occurred:", error);

//       if (error.response && error.response.status === 401 && !refresh) {
//         console.log(
//           "401 Unauthorized error detected, attempting token refresh..."
//         );

//         refresh = true;

//         // Perform token refresh request
//         const response = await api.post(
//           "/refresh",
//           {},
//           { withCredentials: true }
//         );

//         console.log("Refresh response:", response.data);

//         if (response.status === 200) {
//           // Update Authorization header with new access token
//           api.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${response.data.accessToken}`;

//           // Retry the original request
//           console.log("Retrying original request...");
//           return axios.request(error.config);
//         }
//       }
//     } catch (refreshError) {
//       console.error("Token refresh failed", refreshError);
//     } finally {
//       refresh = false; // Reset refresh flag
//     }

//     // If refresh fails or if not a 401 error, reject the promise with the original error
//     return Promise.reject(error);
//   }
// );

// export default api;
