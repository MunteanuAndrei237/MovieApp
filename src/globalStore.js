import {configureStore} from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import userReducer from './slices/userSlice';
import favouriteReducer from './slices/favouriteSlice';

const globalStore = configureStore({
    reducer: {
        home: homeReducer,
        user: userReducer,
        favourite: favouriteReducer,
    }
});

export default globalStore;