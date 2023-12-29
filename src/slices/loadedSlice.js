//slice used for storing all the movies and their details , it is used everywhere you see a movie
import { createSlice } from "@reduxjs/toolkit";

const loadedSlice = createSlice({
  name: "loaded",
  initialState: {
    loadedMovies: {},
    addedState: "idle",
  },
  reducers: {
    changeFavouritesLocation(state, action) {
      const id = action.payload;
      if (state.loadedMovies[id].locations.indexOf("favourites") === -1)
        state.loadedMovies[id].locations.push("favourites");
      else
        state.loadedMovies[id].locations = state.loadedMovies[
          id
        ].locations.filter((location) => location !== "favourites");
    },
    addMovieToLocation(state, action) {
      const movies = action.payload.movies;
      if (action.payload.useTerm === true)
        var location = "term=" + action.payload.location;
      else location = action.payload.location;
      movies.forEach((movie) => {
        if (
          movie.id in state.loadedMovies &&
          state.loadedMovies[movie.id].locations.indexOf(location) === -1
        ) {
          state.loadedMovies[" " + movie.id].locations.push(location); //here i am adding a space because JS sorts the object and I need to keep the order for when people load more movies/pages
        } else {
          state.loadedMovies[" " + movie.id] = {
            ...movie,
            locations: [location],
          };
        }
      });
    },
    addEmptyMovie(state, action) {
      const id = action.payload.id;
      state.loadedMovies[id] = { locations: [] };
      state.addedState = "succedeeded";
    },
    addDetails(state, action) {
      const id = action.payload.id;
      const movieDetails = action.payload.details;
      state.loadedMovies[id].detailsFetched = true;
      for (const key in movieDetails)
        state.loadedMovies[id][key] = movieDetails[key];
    },
    addCast(state, action) {
      const id = action.payload.id;
      const movieCast = action.payload.cast;
      state.loadedMovies[id].cast = movieCast;
    },
    addPhotos(state, action) {
      const id = action.payload.id;
      const moviePhotos = action.payload.photos;
      state.loadedMovies[id].photos = moviePhotos;
    },
    addReviews(state, action) {
      const id = action.payload.id;
      const movieReviews = action.payload.reviews;
      state.loadedMovies[id].reviews = movieReviews;
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
