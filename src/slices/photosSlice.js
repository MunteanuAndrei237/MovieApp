//slice udes for fetching and handling photos of a movie
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require("node-fetch");

const fetchPhotosThunk = createAsyncThunk(
  "photos/fetchPhotos",
  async (movieId) => {
    try {
      const url = "https://api.themoviedb.org/3/movie/" + movieId + "/images";
      const options = getOptions;
      const response = await fetch(url, options);
      const json = await response.json();
      return json.backdrops;
    } catch (error) {
      console.error("Error fetching photos. ", error);
      throw new Error("Error fetching photos. " + error);
    }
  },
);

const photosSlice = createSlice({
  name: "photos",
  initialState: {
    photos: [],
    photosStatus: "idle",
    photosError: null,
    photosLoaded: 8,
  },
  reducers: {
    showMorePhotos(state, action) {
      state.photosLoaded += action.payload;
    },
    resetPhotosToIdle(state) {
      state.photosStatus = "idle";
      state.photos = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPhotosThunk.pending, (state) => {
      state.photosStatus = "loading";
    });
    builder.addCase(fetchPhotosThunk.fulfilled, (state, action) => {
      state.photosStatus = "succeeded";
      state.photos = action.payload;
    });
    builder.addCase(fetchPhotosThunk.rejected, (state, action) => {
      state.photosStatus = "failed";
      state.photosError = action.error.message;
    });
  },
});

export default photosSlice.reducer;
export const { showMorePhotos, resetPhotosToIdle } = photosSlice.actions;
export { fetchPhotosThunk };
