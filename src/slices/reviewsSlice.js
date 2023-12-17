import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require("node-fetch");

const fetchReviewsThunk = createAsyncThunk(
  "details/fetchReviewsThunk",
  async (movieId) => {
    try {
      const url = "https://api.themoviedb.org/3/movie/" + movieId + "/reviews";
      const options = getOptions;
      const response = await fetch(url, options);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error fetching reviews. ", error);
      throw new Error("Error fetching reviews. " + error);
    }
  },
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    reviewsStatus: "idle",
    reviewsError: null,
  },
  reducers: {
    resetReviewsToIdle(state) {
      state.reviewsStatus = "idle";
      state.reviews = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchReviewsThunk.pending, (state) => {
      state.reviewsStatus = "loading";
    });
    builder.addCase(fetchReviewsThunk.fulfilled, (state, action) => {
      state.reviewsStatus = "succeeded";
      state.reviews = action.payload.results;
    });
    builder.addCase(fetchReviewsThunk.rejected, (state, action) => {
      state.reviewsStatus = "failed";
      state.reviewsError = action.error.message;
    });
  },
});

export default reviewsSlice.reducer;
export const { resetReviewsToIdle } = reviewsSlice.actions;
export { fetchReviewsThunk };
