import axios from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAnimals = createAsyncThunk(
  "animals/fetchAnimals",
  async () => {
    const response = await axios.get("/animals/all");
    return response.data;
  }
);

export const fetchAnimalById = createAsyncThunk(
  "animals/fetchAnimalById",
  async (id) => {
    const response = await axios.get(`/animals/${id}`);
    return response.data;
  }
);

export const deleteAnimal = createAsyncThunk(
  "animals/deleteAnimal",
  async ({ id, toast }) => {
    const response = await axios.delete(`/animals/${id}`);
    if (response.data.status === "success") {
      toast.success(response.data.message);
      return id;
    }
  }
);

export const searchAnimals = createAsyncThunk(
  "animals/searchAnimals",
  async ({ name, slaughterhouseId }) => {
    const response = await axios.get(
      `/animals/search/${name}/slaughterhouseId/${slaughterhouseId}`
    );
    return response.data;
  }
);

export const searchCustomer = createAsyncThunk(
  "animals/searchCustomer",
  async (name) => {
    const response = await axios.get(`/animals/search/customer/${name}`);
    return response.data;
  }
);

export const searchTransaction = createAsyncThunk(
  "animals/searchTransaction",
  async ({ name, slaughterhouseId }) => {
    const response = await axios.get(
      `/animals/search/transaction/${name}/slaughterhouseId/${slaughterhouseId}`
    );
    return response.data;
  }
);

export const filterAnimalsByType = createAsyncThunk(
  "animals/filterAnimalsByType",
  async ({ type, slaughterhouseId }) => {
    const response = await axios.get(
      `/animals/type/${type}/slaughterhouseId/${slaughterhouseId}`
    );
    return response.data;
  }
);

export const filterByStatus = createAsyncThunk(
  "animals/filterByStatus",
  async ({ status, slaughterhouseId }) => {
    const response = await axios.get(
      `/animals/filter/${status}/slaughterhouseId/${slaughterhouseId}`
    );
    return response.data;
  }
);

export const getTransactionBySlaughterhouse = createAsyncThunk(
  "animals/getTransactionBySlaughterhouse",
  async (slaughterhouseId) => {
    const response = await axios.get(
      `/animals/transaction/${slaughterhouseId}`
    );
    return response.data;
  }
);

export const filterByDateRange = createAsyncThunk(
  "animals/filterByDateRange",
  async ({ startDate, endDate, slaughterhouseId }) => {
    const response = await axios.get(
      `/animals/filter/${startDate}/${endDate}/slaughterhouseId/${slaughterhouseId}`
    );
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  "animals/updateTransaction",
  async ({ id, toast }) => {
    const response = await axios.put(`/transactions/${id}`);
    if (response.data.status === "success") {
      toast.success(response.data.message);
      return id;
    }
  }
);

export const filterAllAnimals = createAsyncThunk(
  "animals/filter-all-animals",
  async ({
    type,
    startDate,
    endDate,
    slaughterhouseId,
    name,
    status,
    transactionID,
    customerName,
  }) => {
    // Build query parameters only if they are provided
    const queryParams = new URLSearchParams();
    if (type) queryParams.append("type", type);
    if (slaughterhouseId)
      queryParams.append("slaughterhouseId", slaughterhouseId);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (name) queryParams.append("name", name);
    if (status) queryParams.append("status", status);
    if (transactionID) queryParams.append("transactionID", transactionID);
    if (customerName) queryParams.append("customerName", customerName);

    const response = await axios.get(
      `/animals/filter-all-animals?${queryParams.toString()}`
    );
    return response.data;
  }
);

const animalsSlice = createSlice({
  name: "animals",
  initialState: {
    animals: [],
    customer: [],
    animalByid: null,
    filteredAnimals: [],
    //   cattle: [],
    //   goast: [],
    //   pigs: [],
    status: {
      animals: "idle",
      search: "idle",
      filter: "idle",
    },
  },
  error: null,
  reducers: {
    clearSearch: (state) => {
      state.customer = [];
    },
    clearId: (state) => {
      state.animalByid = null;
    },
  },
  extraReducers(builders) {
    builders
      // fetch animals cases
      .addCase(fetchAnimals.pending, (state) => {
        state.status.animals = "loading";
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.status.animals = "succeeded";
        state.animals = action.payload;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.status.animals = "failed";
        state.error = action.error.message;
      })
      // fetch animal by id
      .addCase(fetchAnimalById.pending, (state) => {
        state.status.fetchById = "loading";
      })
      .addCase(fetchAnimalById.fulfilled, (state, action) => {
        state.status.fetchById = "succeeded";
        state.animalByid = action.payload;
      })
      .addCase(fetchAnimalById.rejected, (state, action) => {
        state.status.fetchById = "failed";
        state.error = action.error.message;
      })
      // delete animal cases
      .addCase(deleteAnimal.pending, (state) => {
        state.status.animals = "loading";
      })
      .addCase(deleteAnimal.fulfilled, (state, action) => {
        state.status.animals = "succeeded";
        state.animals = state.animals.filter(
          (animal) => animal.id !== action.payload
        );
      })
      .addCase(deleteAnimal.rejected, (state, action) => {
        state.status.animals = "failed";
        state.error = action.error.message;
      })
      // search animal cases
      .addCase(searchAnimals.pending, (state) => {
        state.status.search = "loading";
      })
      .addCase(searchAnimals.fulfilled, (state, action) => {
        state.status.search = "succeeded";
        state.animals = action.payload;
      })
      .addCase(searchAnimals.rejected, (state, action) => {
        state.status.search = "failed";
        state.error = action.error.message;
      })
      // search customer cases
      .addCase(searchCustomer.pending, (state) => {
        state.status.search = "loading";
      })
      .addCase(searchCustomer.fulfilled, (state, action) => {
        state.status.search = "succeeded";
        state.customer = action.payload;
      })
      .addCase(searchCustomer.rejected, (state, action) => {
        state.status.search = "failed";
        state.error = action.error.message;
      })
      // search transaction cases
      .addCase(searchTransaction.pending, (state) => {
        state.status.search = "loading";
      })
      .addCase(searchTransaction.fulfilled, (state, action) => {
        state.status.search = "succeeded";
        state.animals = action.payload;
      })
      .addCase(searchTransaction.rejected, (state, action) => {
        state.status.search = "failed";
        state.error = action.error.message;
      })
      // filter animal cases
      .addCase(filterAnimalsByType.pending, (state) => {
        state.status.filter = "loading";
      })
      .addCase(filterAnimalsByType.fulfilled, (state, action) => {
        state.status.filter = "succeeded";
        state.animals = action.payload;
      })
      .addCase(filterAnimalsByType.rejected, (state, action) => {
        state.status.filter = "failed";
        state.error = action.error.message;
      })
      // filter by status cases
      .addCase(filterByStatus.pending, (state) => {
        state.status.filter = "loading";
      })
      .addCase(filterByStatus.fulfilled, (state, action) => {
        state.status.filter = "succeeded";
        state.animals = action.payload;
      })
      .addCase(filterByStatus.rejected, (state, action) => {
        state.status.filter = "failed";
        state.error = action.error.message;
      })
      // get transaction by slaughterhouse cases
      .addCase(getTransactionBySlaughterhouse.pending, (state) => {
        state.status.filter = "loading";
      })
      .addCase(getTransactionBySlaughterhouse.fulfilled, (state, action) => {
        state.status.filter = "succeeded";
        state.animals = action.payload;
      })
      .addCase(getTransactionBySlaughterhouse.rejected, (state, action) => {
        state.status.filter = "failed";
        state.error = action.error.message;
      })
      // filter by date range cases
      .addCase(filterByDateRange.pending, (state) => {
        state.status.filter = "loading";
      })
      .addCase(filterByDateRange.fulfilled, (state, action) => {
        state.status.filter = "succeeded";
        state.animals = action.payload;
      })
      .addCase(filterByDateRange.rejected, (state, action) => {
        state.status.filter = "failed";
        state.error = action.error.message;
      })
      // update transaction cases
      .addCase(updateTransaction.pending, (state) => {
        state.status.filter = "loading";
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.status.animals = "succeeded";
        state.animals = state.animals.map((animal) => {
          if (animal.id === action.payload.id) {
            return action.payload;
          }
          return animal;
        });
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.status.filter = "failed";
        state.error = action.error.message;
      })
      // filter all documents cases
      .addCase(filterAllAnimals.pending, (state) => {
        state.status.filter = "loading";
      })
      .addCase(filterAllAnimals.fulfilled, (state, action) => {
        state.status.filter = "succeeded";
        state.filteredAnimals = action.payload;
      })
      .addCase(filterAllAnimals.rejected, (state, action) => {
        state.status.filter = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAnimals = (state) => state.animals.animals;
export const getAnimalById = (state) => state.animals.animalByid;
export const getAnimalsStatus = (state) => state.animals.status;
export const getCustomer = (state) => state.animals.customer;
export const getFilteredAnimals = (state) => state.animals.filteredAnimals;

export const { clearSearch } = animalsSlice.actions;
export const { clearId } = animalsSlice.actions;

export default animalsSlice.reducer;
