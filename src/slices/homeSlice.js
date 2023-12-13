import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require('node-fetch');

const fetchHomeMoviesThunk = createAsyncThunk('home/fetchHomeMovies', async (_ , { getState}) => {
  if(getState().home.homePage <= getState().home.homeTotalPages)
  {
  const homeMoviesUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=' + getState().home.homePage;
  const options = getOptions;
  try {
    const response = await fetch(homeMoviesUrl, options);
    const data = await response.json();
    if(getState().home.homePage===1)
      return {results:data.results,totalPages:data.total_pages};
    else
      return data.results;
    }
   catch (error) {
    console.error('error:', error);
    throw error;
  }
}}
)

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    homeMovies:[],
    homeStatus: 'idle',
    homeError: null,
    homePage:1,
    homeTotalPages: 100
  },
  reducers: {

  },
  extraReducers(builder){
    builder.addCase(fetchHomeMoviesThunk.pending, (state) => {
      state.homeStatus = 'loading';
    });
    builder.addCase(fetchHomeMoviesThunk.fulfilled, (state, action) => {
      state.homeStatus = 'succeeded';
      if(state.homePage===1)
      {
        
        state.homeTotalPages = action.payload.totalPages;
        state.homeMovies = action.payload.results;
      }
      else
        state.homeMovies = action.payload;
        state.homePage++;
    });
    builder.addCase(fetchHomeMoviesThunk.rejected, (state, action) => {
      state.homeStatus = 'failed';
      state.homeError = action.error.message;
    });
  }
});

export { fetchHomeMoviesThunk };
export default homeSlice.reducer;