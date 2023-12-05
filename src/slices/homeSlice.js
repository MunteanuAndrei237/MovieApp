import {createSlice , createAsyncThunk } from '@reduxjs/toolkit';
const fetch = require('node-fetch');
const homeMoviesUrl = 'https://api.themoviedb.org/3/movie/popular';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGQ3NGQ0NTRmOTVmOTU3MDliY2QyOWRhMzVkOWE1NyIsInN1YiI6IjY1NmRlMzQ1NGE0YmY2MDEzZDhmNDNkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.psRlcMIT2Qtn0VesRX43LYqfEE-vFLD7JhPwN4W9uHc'
  }
};

const fetchHomeMoviesThunk = createAsyncThunk('home/fetchHomeMovies', async () =>
{
    let myres;
    await fetch(homeMoviesUrl, options)
    .then(res => myres= res.json())
    .catch(err => console.error('error:' + err));
    return myres;
}
)

const homeSlice = createSlice({
    name: 'home',
    initialState: {
        status: 'idle',
        error: null,
        homeMovies:[]
    },
    reducers: {

    },
    extraReducers(builder){
        builder.addCase(fetchHomeMoviesThunk.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchHomeMoviesThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.homeMovies = action.payload.results;
        });
        builder.addCase(fetchHomeMoviesThunk.rejected, (state) => {
            state.status = 'failed';
            state.error = 'We encountered an error';
        });
    }
});

export {fetchHomeMoviesThunk};
export default homeSlice.reducer;