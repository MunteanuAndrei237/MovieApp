import { configureStore } from '@reduxjs/toolkit';
import loadedMoviesSlice from './slices/loadedMoviesSlice.js';
import genreSlice from './slices/genresSlice.js';
import userSlice from './slices/userSlice.js';
import searchSlice from './slices/searchSlice.js';
import movieDetailsSlice from './slices/movieDetailsSlice.js';
import homeSlice from './slices/homeSlice.js';
import favouritesSlice from './slices/favouritesSlice.js';

const globalStore = configureStore({
  reducer: {
    loadedMovies: loadedMoviesSlice,
    favourites: favouritesSlice,
    home: homeSlice,
    genre: genreSlice,
    user: userSlice,
    search: searchSlice,
    movieDetails: movieDetailsSlice,
  },
});

export default globalStore;
