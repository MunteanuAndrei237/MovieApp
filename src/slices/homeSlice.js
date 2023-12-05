import {createSlice , createAsyncThunk } from '@reduxjs/toolkit';
const fetch = require('node-fetch');
const homeMoviesUrl = 'https://api.themoviedb.org/3/movie/popular';
const moovieDetailsUrl = 'https://api.themoviedb.org/3/movie/';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGQ3NGQ0NTRmOTVmOTU3MDliY2QyOWRhMzVkOWE1NyIsInN1YiI6IjY1NmRlMzQ1NGE0YmY2MDEzZDhmNDNkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.psRlcMIT2Qtn0VesRX43LYqfEE-vFLD7JhPwN4W9uHc'
  }
};
let indexMovies = -1
const fetchMoovieDetailsByIdThunk = createAsyncThunk('home/fetchMoovieDetailsById', async ({id,index}) => {
    try {
      const response = await fetch(moovieDetailsUrl + id, options);
      const data = await response.json();
      console.log('data:', data)
      return { ...data, index: index,detailsFetched:true };
    } catch (error) {
      console.error('error:', error);
      throw error; 
    }
  });

const fetchHomeMoviesThunk = createAsyncThunk('home/fetchHomeMovies', async () =>
{
    try {
        const response = await fetch(homeMoviesUrl, options);
        const data = await response.json();
        const newData = data.results.map((obj) => 
        ({
            ...obj,
            imageFetched: false,
            detailsFetched: false,
            index: ++indexMovies,
          }));
        return newData;
      } catch (error) {
        console.error('error:', error);

      }
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
            state.homeMovies = action.payload;
        });
        builder.addCase(fetchHomeMoviesThunk.rejected, (state) => {
            state.status = 'failed';
            state.error = 'We encountered an error';
        });
        builder.addCase(fetchMoovieDetailsByIdThunk.fulfilled, (state, action) => {
            state.homeMovies[Number(action.payload.index)]={...state.homeMovies[Number(action.payload.index)],...action.payload}
        });
    }
});

export {fetchHomeMoviesThunk , fetchMoovieDetailsByIdThunk};
export default homeSlice.reducer;