import { createSlice } from "@reduxjs/toolkit";

const loadedSlice = createSlice({
  name: "loaded",
  initialState: {
    loadedMovies: [],
    loadedMovieIds: [],
    addedState: "idle",
  },
  reducers: {
    changeFavouritesLocation(state, action) {
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === action.payload) {
          if (loadedMovie.locations.indexOf("favourites") === -1)
            loadedMovie.locations.push("favourites");
          else
            loadedMovie.locations = loadedMovie.locations.filter(
              (location) => location !== "favourites",
            );
        }
      });
    },
    addMovieToLocation(state, action) {
      const movies = action.payload.movies;
      if (action.payload.useTerm === true)
        var location = "term=" + action.payload.location;
      else location = action.payload.location;
      movies.forEach((movie) => {
        if (state.loadedMovieIds.indexOf(movie.id) === -1) {
          state.loadedMovies.push({ ...movie, locations: [location] });
          state.loadedMovieIds.push(movie.id);
        } else {
          state.loadedMovies.forEach((loadedMovie) => {
            if (
              loadedMovie.id === movie.id &&
              loadedMovie.locations.indexOf(location) === -1
            )
              loadedMovie.locations.push(location);
          });
        }
      });
    },
    addEmptyMovie(state, action) {
      const id = action.payload.id;
      state.loadedMovies.push({ id: id, locations: [] });
      state.loadedMovieIds.push(id);
      state.addedState = "succedeeded";
    },
    addDetails(state, action) {
      const id = action.payload.id;
      const movieDetails = action.payload.details;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) {
          loadedMovie.detailsFetched = true;
          for (const key in movieDetails) loadedMovie[key] = movieDetails[key];
        }
      });
    },
    addCast(state, action) {
      const id = action.payload.id;
      const movieCast = action.payload.cast;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) loadedMovie.cast = movieCast;
      });
    },
    addPhotos(state, action) {
      const id = action.payload.id;
      const moviePhotos = action.payload.photos;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) loadedMovie.photos = moviePhotos;
      });
    },
    addReviews(state, action) {
      const id = action.payload.id;
      const movieReviews = action.payload.reviews;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) loadedMovie.reviews = movieReviews;
      });
    },
  },
});
export default loadedSlice.reducer;
export const {
  changeFavouritesLocation,
  addMovieToLocation,
  addCast,
  addDetails,
  addPhotos,
  addReviews,
  addEmptyMovie,
} = loadedSlice.actions;
