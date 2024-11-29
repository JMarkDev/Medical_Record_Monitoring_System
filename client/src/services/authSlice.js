import axios from "../api/axios";
import Cookies from "js-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("/auth/fetchUser", async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    return null;
  }
  const response = await axios.get("/protected", { withCredentials: true });
  const email = response.data.user.email;

  if (email) {
    const userResponse = await axios.get(`/users/get-user?email=${email}`);
    return userResponse.data;
  }

  return response.data;
});

export const logoutUser = createAsyncThunk("/auth/logoutUser", async () => {
  const response = await axios.post("/auth/logout", { withCredentials: true });
  if (response.data.status === "success") {
    Cookies.remove("accessToken");
    return null;
  }
  // return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
    loading: true,
  },
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Selectors
export const getUserData = (state) => state.auth.userData;
export const getLoading = (state) => state.auth.loading;
export const getAuthError = (state) => state.auth.error;

export default authSlice.reducer;
