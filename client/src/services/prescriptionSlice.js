import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPrescriptionsByStatus = createAsyncThunk(
  "prescriptions/fetchPrescriptionsByStatus",
  async (status) => {
    const response = await axios.get(`/prescriptions/get-by-status/${status}`);
    return response.data;
  }
);

export const addPrescription = createAsyncThunk(
  "prescriptions/addPrescription",
  async (prescription) => {
    const response = await axios.post("/prescriptions/add", prescription);
    return response.data;
  }
);

export const updatePrescriptionStatus = createAsyncThunk(
  "prescriptions/updatePrescriptionStatus",
  async ({ id, status, toast }) => {
    try {
      const response = await axios.put(`/prescriptions/update-status/${id}`, {
        status,
      });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      toast(error.response.data.message);
      return error.response.data;
    }
  }
);

export const searchPrescription = createAsyncThunk(
  "prescriptions/searchPrescription",
  async ({ search }) => {
    const response = await axios.get(`/prescriptions/search/${search}`);
    return response.data;
  }
);

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    prescriptions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builders) {
    builders.addCase(fetchPrescriptionsByStatus.pending, (state) => {
      state.status = "loading";
    });
    builders.addCase(fetchPrescriptionsByStatus.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.prescriptions = action.payload.data;
    });
    builders.addCase(fetchPrescriptionsByStatus.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builders.addCase(addPrescription.fulfilled, (state, action) => {
      state.prescriptions.push(action.payload.data);
    });

    builders
      .addCase(updatePrescriptionStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload.data;
        const existingPrescription = state.prescriptions.find(
          (prescription) => prescription.id === id
        );

        if (existingPrescription) {
          existingPrescription.status = status;
        }
      })
      .addCase(searchPrescription.fulfilled, (state, action) => {
        state.prescriptions = action.payload.data;
      })
      .addCase(searchPrescription.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePrescriptionStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const getPrescriptions = (state) => state.prescriptions.prescriptions;
export default prescriptionSlice.reducer;
