import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../accessToken";
const fetch = require('node-fetch');

const fetchHomeMoviesThunk = createAsyncThunk('home/fetchHomeMovies', async (page) => {
  console.log(page);
  const homeMoviesUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page='+page;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: accessToken
    }
  };
  try {
    const response = await fetch(homeMoviesUrl, options);
    const data = await response.json();
    return data.results;
    }
   catch (error) {
    console.error('error:', error);
  }
}
)

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    homeMovies:[],
    homeStatus: 'idle',
    homeError: null,
  },
  reducers: {

  },
  extraReducers(builder){
    builder.addCase(fetchHomeMoviesThunk.pending, (state) => {
      state.homeStatus = 'loading';
    });
    builder.addCase(fetchHomeMoviesThunk.fulfilled, (state, action) => {
      state.homeStatus = 'succeeded';
      state.homeMovies = action.payload;
    });
    builder.addCase(fetchHomeMoviesThunk.rejected, (state) => {
      state.homeStatus = 'failed';
      state.homeError = 'We encountered an error';
    });
  }
});

export { fetchHomeMoviesThunk };
export default homeSlice.reducer;