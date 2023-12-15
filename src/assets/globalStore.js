import { configureStore } from '@reduxjs/toolkit';
import loadedMoviesSlice from '../slices/loadedSlice.js';
import genresSlice from '../slices/genresSlice.js';
import userSlice from '../slices/userSlice.js';
import searchSlice from '../slices/searchSlice.js';
import detailsSlice from '../slices/detailsSlice.js';
import homeSlice from '../slices/homeSlice.js';
import favouritesSlice from '../slices/favouritesSlice.js';

const globalStore = configureStore({
  reducer: {
    loadedMovies: loadedMoviesSlice,
    favourites: favouritesSlice,
    home: homeSlice,
    genres: genresSlice,
    user: userSlice,
    search: searchSlice,
    details: detailsSlice,
  },
});

export default globalStore;
