import api from "../api/axios";
import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllPatients = createAsyncThunk(
  "patients/fetchAllPatients",
  async (status) => {
    const response = await axios.get(
      `/patients/get-all-patients?status=${status}`
    );

    return response.data;
  }
);

export const addPatient = createAsyncThunk(
  "patients/addPatient",
  async (patient) => {
    const response = await axios.post("/patients/add-patient", patient);
    return response.data;
  }
);

export const searchPatient = createAsyncThunk(
  "patients/searchPatient",
  async ({ searchQuery, status }) => {
    const response = await axios.get(
      `/patients/search-patient?searchQuery=${searchQuery}&status=${status}`
    );
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  "patients/updatePatient",
  async ({ id, patient }) => {
    const response = await axios.put(`/patients/update-patient/${id}`, patient);
    return response.data;
  }
);

export const deletePatient = createAsyncThunk(
  "patients/deletePatient",
  async ({ id, toast }) => {
    const response = await axios.delete(`/patients/delete-patient/${id}`);
    if (response.data.status === "success") {
      toast.success(response.data.message);
      return id;
    }
    throw new Error("Failed to delete user");
  }
);

export const fetchPatientById = createAsyncThunk(
  "patients/fetchPatientById",
  async (id) => {
    const response = await axios.get(`/patients/get-patient-by-id/${id}`);
    return response.data;
  }
);

export const updatePatientStatus = createAsyncThunk(
  "patients/updatePatientStatus",
  async ({ id, status, toast }) => {
    const data = { status: status };
    const response = await axios.put(
      `/patients/update-patient-status/${id}`,
      data
    );
    if (response.data.status === "success") {
      toast.success(response.data.message);
      return id;
    }
    // return response.data;
  }
);

export const filterPatients = createAsyncThunk(
  "patients/filter-patient",
  async ({ startDate, endDate, gender, status, patientName }) => {
    const queryParams = new URLSearchParams();
    if (startDate) {
      queryParams.append("startDate", startDate);
    }
    if (endDate) {
      queryParams.append("endDate", endDate);
    }
    if (gender) {
      queryParams.append("gender", gender);
    }

    if (status) {
      queryParams.append("status", status);
    }

    if (patientName) {
      queryParams.append("patientName", patientName);
    }

    const response = await api.get(
      `/patients/filter-patient?${queryParams.toString()}`
    );
    return response.data;
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [],
    filteredPatients: [],
    patientById: {},
    status: null,
    error: null,
  },
  reducers: {
    reset: (state) => {
      state.patients = [];
      state.patientById = {};
    },
  },
  extraReducers(builders) {
    builders
      .addCase(fetchAllPatients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = action.payload;
      })

      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(filterPatients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(filterPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredPatients = action.payload;
      })
      .addCase(filterPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchPatientById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patientById = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload.patient);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.patients = state.patients.map((patient) =>
          patient.id === action.payload.patient.id
            ? action.payload.patient
            : patient
        );
      })
      .addCase(deletePatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = state.patients.filter(
          (patient) => patient.id !== action.payload
        );
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(searchPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = action.payload;
      })
      .addCase(searchPatient.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(updatePatientStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = state.patients.filter(
          (patient) => patient.id !== action.payload
        );
      });
  },
});

export const getAllPatients = (state) => state.patients.patients;
export const getPatientById = (state) => state.patients.patientById;
export const getFilterPatients = (state) => state.patients.filteredPatients;
export const { reset } = patientSlice.actions;

export default patientSlice.reducer;
