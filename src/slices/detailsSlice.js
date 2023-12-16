import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require('node-fetch');


const fetchDetailsThunk = createAsyncThunk('details/fetchDetails', async (movieId) => {
    try{
        const url = 'https://api.themoviedb.org/3/movie/'+movieId;
        const options = getOptions;
        const response = await fetch(url, options)
        const json = await response.json();
        return json;
    }
    catch(error){
        console.error('Error fetching details. ', error);
        throw new Error('Error fetching details. ' + error);
    }
});
const detailsSlice = createSlice({
    name: "details",
    initialState: {
        details: {},
        detailsStatus: 'idle',
        detailsError: null,
    },
    reducers: {
       
        resetDetailsToIdle(state) {
        state.detailsStatus = 'idle';
        state.details = {};
        },
        
    },
    extraReducers(builder) {
        builder.addCase(fetchDetailsThunk.pending, (state) => {
        state.detailsStatus = 'loading';
        });
        builder.addCase(fetchDetailsThunk.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.details = action.payload;
        });
        builder.addCase(fetchDetailsThunk.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.detailsError = action.error.message;
        });
    }});

export const { resetDetailsToIdle  } = detailsSlice.actions ;
export { fetchDetailsThunk };
export default detailsSlice.reducer;

