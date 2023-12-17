import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require("node-fetch");

const fetchHomeMoviesThunk = createAsyncThunk(
  "home/fetchHomeMovies",
  async (_, { getState }) => {
    try {
      const url =
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=" +
        getState().home.homePage;
      const options = getOptions;
      const response = await fetch(url, options);
      const json = await response.json();
      if (getState().home.homePage === 1)
        return { results: json.results, totalPages: json.total_pages };
      else return json.results;
    } catch (error) {
      console.error("Error fetching home movies. ", error);
      throw new Error("Error fetching home movies. " + error);
    }
  },
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    homeMovies: [],
    homeStatus: "idle",
    homeError: null,
    homePage: 1,
    homeTotalPages: 100,
  },
  reducers: {
    resetHomeToIdle(state) {
      state.homeStatus = "idle";
      state.homeMovies = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchHomeMoviesThunk.pending, (state) => {
      state.homeStatus = "loading";
    });
    builder.addCase(fetchHomeMoviesThunk.fulfilled, (state, action) => {
      state.homeStatus = "succeeded";
      if (state.homePage === 1) {
        state.homeTotalPages = action.payload.totalPages;
        state.homeMovies = action.payload.results;
      } else state.homeMovies = action.payload;
      state.homePage++;
    });
    builder.addCase(fetchHomeMoviesThunk.rejected, (state, action) => {
      state.homeStatus = "failed";
      state.homeError = action.error.message;
    });
  },
});

export default homeSlice.reducer;
export const { resetHomeToIdle } = homeSlice.actions;
export { fetchHomeMoviesThunk };
