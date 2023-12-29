//slice used for fetching and handling search results based on a term
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require("node-fetch");

const fetchMoviesByTermThunk = createAsyncThunk(
  "/search/fetchMoviesByTermThunk",
  async (term, { getState }) => {
    try {
      const url =
        "https://api.themoviedb.org/3/search/movie?query=" +
        term +
        "&include_adult=false&language=en-US&page=" +
        (getState().search.searchPage[term] === undefined
          ? 1
          : getState().search.searchPage[term]);
      const options = getOptions;
      const response = await fetch(url, options);
      const json = await response.json();
      if (getState().search.searchPage[term] === undefined)
        return {
          results: json.results,
          totalPages: json.total_pages,
          term: term,
        };
      else return { results: json.results, term: term };
    } catch (error) {
      console.error("Searching Error. ", error.message);
      throw new Error("Searching Error. " + error.message);
    }
  },
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    searchStatus: "idle",
    searchError: null,
    searchMovies: [],
    searchPage: {},
    searchTotalPages: {},
  },
  reducers: {
    changeSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    resetSearchToIdle(state) {
      state.searchStatus = "idle";
      state.Movies = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMoviesByTermThunk.pending, (state) => {
      state.searchStatus = "loading";
    });
    builder.addCase(fetchMoviesByTermThunk.fulfilled, (state, action) => {
      state.searchStatus = "succeeded";
      if (state.searchPage[action.payload.term] === undefined) {
        state.searchTotalPages[action.payload.term] = action.payload.totalPages;
        state.searchPage[action.payload.term] = 1;
      }
      state.searchMovies = action.payload.results;
      state.searchPage[action.payload.term]++;
    });
    builder.addCase(fetchMoviesByTermThunk.rejected, (state, action) => {
      state.searchStatus = "failed";
      state.searchError = action.error.message;
    });
  },
});

export default searchSlice.reducer;
export const { changeSearchTerm, resetSearchToIdle } = searchSlice.actions;
export { fetchMoviesByTermThunk };
