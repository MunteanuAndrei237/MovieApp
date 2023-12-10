import {configureStore} from '@reduxjs/toolkit';
import userSlice from './slices/userSlice.js';
import loadedMoviesSlice from './slices/loadedMoviesSlice.js';
import searchSlice from './slices/searchSlice.js';
import genreSlice from './slices/genresSlice.js';
import movieDetailsSlice from './slices/movieDetailsSlice.js';

const globalStore = configureStore({
    reducer: {
        loadedMovies: loadedMoviesSlice,
        user: userSlice,
        search: searchSlice,
        genre: genreSlice,
        movieDetails: movieDetailsSlice
    }
});

export default globalStore;