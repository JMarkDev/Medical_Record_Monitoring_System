import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rolesList from "../constants/rolesList";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (role) => {
  const response = await axios.get(`/users/get-all-user?role=${role}`);
  return response.data;
});

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id) => {
    const response = await axios.get(`/users/get-user-by-id/${id}`);
    return response.data;
  }
);

export const approvedAccount = createAsyncThunk(
  "/users/approvedAccount",
  async ({ id, email, toast }) => {
    const response = await axios.put(
      `/users/approved-account/id/${id}/email/${email}`
    );
    if (response.data.status === "success") {
      toast.success(response.data.message);
      return response.data.updatedUser;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "/users/deleteUser",
  async ({ id, toast }) => {
    const response = await axios.delete(`/users/delete/id/${id}`);
    if (response.data.status === "success") {
      toast.success(response.data.message);
      return id;
    }
    throw new Error("Failed to delete user");
  }
);

export const fetchAllDoctors = createAsyncThunk(
  "users/all-doctors",
  async () => {
    async () => {
      const response = await axios.get("/doctors/get-all-doctors");
      return response.data;
    };
  }
);

export const fetchApprovedDoctors = createAsyncThunk(
  "users/approved-doctors",
  async () => {
    const response = await axios.get("/doctors/get-approved-doctors");
    return response.data;
  }
);

const searchRoleUsers = (role) => {
  return createAsyncThunk(`users/search${role}`, async (name) => {
    const response = await axios.get(`/users/search/${name}/${role}`);
    return response.data;
  });
};

export const searchAdminRole = searchRoleUsers(rolesList.admin);
export const searchDoctorRole = searchRoleUsers(rolesList.doctor);
export const searchNurseRole = searchRoleUsers(rolesList.nurse);
// export const searchSlaughterhouseRole = searchRoleUsers(rolesList.supervisor);

export const filterFacultyByCampus = createAsyncThunk(
  "users/filter-faculty",
  async (esuCampus) => {
    const response = await axios.get(`/users/filter-faculty/${esuCampus}`);
    return response.data;
  }
);

// idle: This is the initial state before the request has been initiated. It means that no request has been made yet.
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    roleUsers: {
      admin: [],
      doctors: [],
    },
    userByid: null,

    status: {
      users: "idle",
      fetchById: "idle",
      admin: "idle",
      search: "idle",
      filter: "idle",
    },
  },
  error: null,
  reducers: {
    clearUser(state) {
      state.userByid = null;
    },
  },
  extraReducers(builders) {
    // search faculty
    builders
      // fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.status.users = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status.users = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status.users = "failed";
        state.error = action.error.message;
      })
      // fetch user by id
      .addCase(fetchUserById.pending, (state) => {
        state.status.fetchById = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status.fetchById = "succeeded";
        state.userByid = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status.fetchById = "failed";
        state.error = action.error.message;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.status.users = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status.users = "succeeded";
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status.users = "failed";
        state.error = action.error.message;
      })
      // search admin role
      .addCase(searchAdminRole.pending, (state) => {
        state.status.admin = "loading";
      })
      .addCase(searchAdminRole.fulfilled, (state, action) => {
        state.status.admin = "succeeded";
        state.users = action.payload;
      })
      .addCase(searchAdminRole.rejected, (state, action) => {
        state.status.admin = "failed";
        state.error = action.error.message;
      })
      // search doctor role
      .addCase(searchDoctorRole.pending, (state) => {
        state.status.doctors = "loading";
      })
      .addCase(searchDoctorRole.fulfilled, (state, action) => {
        state.status.doctors = "succeeded";
        state.users = action.payload;
      })
      .addCase(searchDoctorRole.rejected, (state, action) => {
        state.status.doctors = "failed";
        state.error = action.error.message;
      })
      // search nurse role
      .addCase(searchNurseRole.pending, (state) => {
        state.status.nurses = "loading";
      })
      .addCase(searchNurseRole.fulfilled, (state, action) => {
        state.status.nurses = "succeeded";
        state.users = action.payload;
      })
      .addCase(searchNurseRole.rejected, (state, action) => {
        state.status.nurses = "failed";
        state.error = action.error.message;
      })
      // GET ALL DOCTORS
      .addCase(fetchAllDoctors.pending, (state) => {
        state.status.doctors = "loading";
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.status.doctors = "succeeded";
        state.roleUsers.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.status.doctors = "failed";
        state.error = action.error.message;
      })

      // GET APPROVED DOCTORS
      .addCase(fetchApprovedDoctors.pending, (state) => {
        state.status.doctors = "loading";
      })
      .addCase(fetchApprovedDoctors.fulfilled, (state, action) => {
        state.status.doctors = "succeeded";
        state.roleUsers.doctors = action.payload;
      })
      .addCase(fetchApprovedDoctors.rejected, (state, action) => {
        state.status.doctors = "failed";
        state.error = action.error.message;
      })
      .addCase(approvedAccount.pending, (state) => {
        state.status.users = "loading";
      })
      .addCase(approvedAccount.fulfilled, (state, action) => {
        state.status.users = "succeeded";
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(approvedAccount.rejected, (state, action) => {
        state.status.users = "failed";
        state.error = action.error.message;
      });
  },
});

// Selectors
export const getAllUsers = (state) => state.users.users;
export const getUserById = (id) => (state) =>
  state.users.users.find((user) => user.id === id);
export const getUserStatus = (state) => state.users.status.users;
export const getFetchedUserById = (state) => state.users.userByid;
export const getStatusById = (state) => state.users.status.fetchById;

export const getUserError = (state) => state.users.error;

export const getRoleUsers = (role) => (state) => state.users.roleUsers[role];
export const getRoleStatus = (role) => (state) => state.users.status[role];

export const getFilterStatus = (state) => state.users.state.filter;
export const getSearchStatus = (state) => state.user.state.search;
export const getDoctors = (state) => state.users.roleUsers.doctors;

export const { clearUser } = usersSlice.actions;

export default usersSlice.reducer;
