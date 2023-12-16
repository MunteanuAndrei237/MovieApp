import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require('node-fetch');

const fetchCastThunk = createAsyncThunk('cast/fetchCastThunk', async (movieId) => {
    try{
const url = 'https://api.themoviedb.org/3/movie/'+movieId+'/credits?language=en-US';
const options = getOptions;
const response = await fetch(url, options)
const json = await response.json();
return json;
    }
    catch(error){
        console.error('Error fetching the cast. ', error);
        throw new Error('Error fetching the cast. ' + error);
    }
});

const castSlice = createSlice({
    name: "cast",
    initialState: {
        cast: [],
        castStatus: 'idle',
        castError: null,
        castLoaded: 6,
    },
    reducers: {
        showMoreCast(state,action) {
            state.castLoaded += action.payload;
        },
        resetCastToIdle(state) {
            state.castStatus = 'idle';
            state.cast = [];
        }
    },
   extraReducers(builder) {
    builder.addCase(fetchCastThunk.pending, (state) => {
        state.castStatus = 'loading';
        });
        builder.addCase(fetchCastThunk.fulfilled, (state, action) => {
        state.castStatus = 'succeeded';
        state.cast = action.payload.cast;
        });
        builder.addCase(fetchCastThunk.rejected, (state, action) => {
        state.castStatus = 'failed';
        state.castError = action.error.message;
        });
    }
});

export default castSlice.reducer;
export const { showMoreCast, resetCastToIdle } = castSlice.actions;
export { fetchCastThunk }