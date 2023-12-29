//slice udes for fetching and handling genres , fetching and handling movies by genre
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require("node-fetch");

const fetchMoviesByGenreThunk = createAsyncThunk(
  "genres/fetchMoviesByGenreThunk",
  async (genreId, { getState }) => {
    try {
      const url =
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=" +
        getState().genres.genresPage[genreId] +
        "&sort_by=popularity.desc&with_genres=" +
        genreId;
      const options = getOptions;
      const response = await fetch(url, options);
      const json = await response.json();
      if (getState().genres.genresPage[genreId] === 1)
        return {
          results: json.results,
          totalPages: json.total_pages,
          genreId: genreId,
        };
      else return { results: json.results, genreId: genreId };
    } catch (error) {
      console.error("Error feching movies by genre .", error);
      throw new Error("Error feching movies by genre . " + error);
    }
  },
);

const fetchGenresThunk = createAsyncThunk(
  "genres/fetchGenresThunk",
  async () => {
    try {
      const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
      const options = getOptions;
      const response = await fetch(url, options);
      const json = await response.json();
      return json.genres;
    } catch (error) {
      console.error("Error fetching genres. ", error);
      throw new Error("Error fetching genres. " + error);
    }
  },
);

const genresSlice = createSlice({
  name: "genres",
  initialState: {
    genres: [],
    genresStatus: "idle",
    genresError: null,
    movies: [],
    moviesStatus: "idle",
    moviesError: null,
    genresPage: {},
    genresTotalPages: {},
    selectedGenre: "default",
  },
  reducers: {
    resetGenreToIdle(state) {
      state.moviesStatus = "idle";
      state.movies = [];
    },
    selectGenre(state, action) {
      state.selectedGenre = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchGenresThunk.pending, (state) => {
      state.genresStatus = "loading";
    });
    builder.addCase(fetchGenresThunk.fulfilled, (state, action) => {
      state.genresStatus = "succeeded";
      state.genres = action.payload;
      action.payload.forEach((genre) => {
        state.genresTotalPages[genre.id] = 1000;
        state.genresPage[genre.id] = 1;
      });
    });
    builder.addCase(fetchGenresThunk.rejected, (state, action) => {
      state.genresStatus = "failed";
      state.genresError = action.error.message;
    });

    builder.addCase(fetchMoviesByGenreThunk.pending, (state) => {
      state.moviesStatus = "loading";
    });
    builder.addCase(fetchMoviesByGenreThunk.fulfilled, (state, action) => {
      state.moviesStatus = "succeeded";
      if (state.genresPage[action.payload.genreId] === 1)
        state.genresTotalPages[action.payload.genreId] =
          action.payload.totalPages;
      state.movies = action.payload.results;
      state.genresPage[action.payload.genreId]++;
    });
    builder.addCase(fetchMoviesByGenreThunk.rejected, (state, action) => {
      state.moviesStatus = "failed";
      state.moviesError = action.error.message;
    });
  },
});

export default genresSlice.reducer;
export const { selectGenre, resetGenreToIdle } = genresSlice.actions;
export { fetchGenresThunk, fetchMoviesByGenreThunk };
