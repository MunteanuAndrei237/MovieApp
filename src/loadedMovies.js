import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
const fetch = require('node-fetch');
import accessToken from "../accessToken";


const loadedMoviesSlice = createSlice({
    name: 'loadedMovies',
    initialState: {
        status: 'idle',
        error: null,
        loadedMovies: [],
    },
    reducers: {
       
    },
});