import { configureStore } from '@reduxjs/toolkit';
import loadedSlice from '../slices/loadedSlice.js';
import genresSlice from '../slices/genresSlice.js';
import userSlice from '../slices/userSlice.js';
import searchSlice from '../slices/searchSlice.js';
import detailsSlice from '../slices/detailsSlice.js';
import homeSlice from '../slices/homeSlice.js';
import favouritesSlice from '../slices/favouritesSlice.js';
import photosSlice from '../slices/photosSlice.js';
import castSlice from '../slices/castSlice.js';
import reviewsSlice from '../slices/reviewsSlice.js';
const globalStore = configureStore({
  reducer: {
    loaded: loadedSlice,
    favourites: favouritesSlice,
    home: homeSlice,
    genres: genresSlice,
    user: userSlice,
    search: searchSlice,
    details: detailsSlice,
    photos: photosSlice,
    cast: castSlice,
    reviews: reviewsSlice,
  },
});

export default globalStore;
