import {configureStore} from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';

const globalStore = configureStore({
    reducer: {
        home: homeReducer,
    }
});

export default globalStore;