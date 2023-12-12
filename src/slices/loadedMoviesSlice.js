import { createSlice } from "@reduxjs/toolkit";

const loadedMoviesSlice = createSlice({
  name: 'loadedMovies',
  initialState: {
    loadedMovies: [],
    loadedMovieIds: [],
  },
  reducers: {
    removeFavouritesLocation(state, action) {
      state.loadedMovies.forEach(loadedMovie => {
        if (loadedMovie.id === action.payload) {
          loadedMovie.locations = loadedMovie.locations.filter(location => location !== "favourites");
        }
      })
    },
    addLoadedMovie(state, action) {
      const movies = action.payload.movies;
      if (action.payload.useTerm === true)
        var location = "term=" + action.payload.location;
      else
         location = action.payload.location;
      movies.forEach(movie => {
        if (state.loadedMovieIds.indexOf(movie.id) === -1) {
          state.loadedMovies.push({ ...movie, locations: [location] });
          state.loadedMovieIds.push(movie.id);
        } else {
          state.loadedMovies.forEach((loadedMovie) => {
            if (loadedMovie.id === movie.id && loadedMovie.locations.indexOf(location) === -1) {
              loadedMovie.locations.push(location);
            }
          });
        }
      });
    },
    addEmptyMovie(state, action) {
      const id = action.payload.id;
      state.loadedMovies.push({ id: id, locations: [] });
      state.loadedMovieIds.push(id);
    },
    addMovieDetails(state, action) {
      const id = action.payload.id;
      const movieDetails = action.payload.details;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) {
          loadedMovie.details = movieDetails;
        }
      });
    },
    addMovieCredits(state, action) {
      const id = action.payload.id;
      const movieCredits = action.payload.credits;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) {
          loadedMovie.credits = movieCredits;
        }
      });

    },
    addMovieImages(state, action) {
      const id = action.payload.id;
      const movieImages = action.payload.images;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) {
          loadedMovie.images = movieImages;
        }
      });

    },
    addMovieReviews(state, action) {
      const id = action.payload.id;
      const movieReviews = action.payload.reviews;
      state.loadedMovies.forEach((loadedMovie) => {
        if (loadedMovie.id === id) {
          loadedMovie.reviews = movieReviews;
        }

      });
    }
  },

});
export const { removeFavouritesLocation, addLoadedMovie, addMovieCredits, addMovieDetails, addMovieImages, addMovieReviews, addEmptyMovie } = loadedMoviesSlice.actions;
export default loadedMoviesSlice.reducer;