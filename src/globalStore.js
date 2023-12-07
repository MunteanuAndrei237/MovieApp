import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import loadedMoviesSlice from './slices/loadedMoviesSlice.js';
import searchSlice from './slices/searchSlice.js';
import genreSlice from './slices/genres.js';

const globalStore = configureStore({
    reducer: {
        loadedMovies: loadedMoviesSlice,
        user: userReducer,
        search: searchSlice,
        genre: genreSlice
    }
});

export default globalStore;