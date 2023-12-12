import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accessToken from "../accessToken";
const fetch = require('node-fetch');

const fetchMovieCreditsByIdThunk = createAsyncThunk('home/fetchMovieCreditsById', async (movieId) => {
const url = 'https://api.themoviedb.org/3/movie/'+movieId+'/credits?language=en-US';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: accessToken
  }
};

const response = await fetch(url, options)
const json = await response.json();
return json;
});
const fetchMovieImagesByIdThunk = createAsyncThunk('home/fetchMovieImagesById', async (movieId) => {
const url = 'https://api.themoviedb.org/3/movie/'+movieId+'/images';
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: accessToken
    }
  };
  
  const response = await fetch(url, options)
  const json = await response.json();
  const newData = json.backdrops.map(image => {
    return image.file_path 
  });
  return newData;
});
const fetchMovieReviewsByIdThunk = createAsyncThunk('home/fetchMovieReviewsById', async (movieId) => {
const url = 'https://api.themoviedb.org/3/movie/'+movieId+'/reviews';
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: accessToken
    }
  };
  
  const response = await fetch(url, options)
  const json = await response.json();
  return json;
});
const fetchMovieDetailsByIdThunk = createAsyncThunk('home/fetchMoovieDetailsById', async (movieId) => {
    const url = 'https://api.themoviedb.org/3/movie/'+movieId;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: accessToken
        }
      };
      
      const response = await fetch(url, options)
      const json = await response.json();
      return json;
    });
const movieDetailsSlice = createSlice({
    name: "movieDetails",
    initialState: {
        movieDetails: {},
        movieDetailsStatus: 'idle',
        movieDetailsError: null,
        movieCredits: {},
        movieCreditsStatus: 'idle',
        movieCreditsError: null,
        movieImages: {},
        movieImagesStatus: 'idle',
        movieImagesError: null,
        movieReviews: {},
        movieReviewsStatus: 'idle',
        movieReviewsError: null
    },
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(fetchMovieCreditsByIdThunk.pending, (state) => {
        state.movieCreditsStatus = 'loading';
        });
        builder.addCase(fetchMovieCreditsByIdThunk.fulfilled, (state, action) => {
        state.movieCreditsStatus = 'succeeded';
        state.movieCredits = action.payload.cast;
        });
        builder.addCase(fetchMovieCreditsByIdThunk.rejected, (state, action) => {
        state.movieCreditsStatus = 'failed';
        state.movieCreditsError = action.error;
        });
    
        builder.addCase(fetchMovieImagesByIdThunk.pending, (state) => {
        state.movieImagesStatus = 'loading';
        });
        builder.addCase(fetchMovieImagesByIdThunk.fulfilled, (state, action) => {
        state.movieImagesStatus = 'succeeded';
        state.movieImages = action.payload;
        });
        builder.addCase(fetchMovieImagesByIdThunk.rejected, (state, action) => {
        state.movieImagesStatus = 'failed';
        state.movieImagesError = action.error;
        });
    
        builder.addCase(fetchMovieReviewsByIdThunk.pending, (state) => {
        state.movieReviewsStatus = 'loading';
        });
        builder.addCase(fetchMovieReviewsByIdThunk.fulfilled, (state, action) => {
        state.movieReviewsStatus = 'succeeded';
        state.movieReviews = action.payload.results;
        });
        builder.addCase(fetchMovieReviewsByIdThunk.rejected, (state, action) => {
        state.movieReviewsStatus = 'failed';
        state.movieReviewsError = action.error;
        });
    
        builder.addCase(fetchMovieDetailsByIdThunk.pending, (state) => {
        state.movieDetailsStatus = 'loading';
        });
        builder.addCase(fetchMovieDetailsByIdThunk.fulfilled, (state, action) => {
        state.movieDetailsStatus = 'succeeded';
        state.movieDetails = action.payload;
        });
        builder.addCase(fetchMovieDetailsByIdThunk.rejected, (state, action) => {
        state.movieDetailsStatus = 'failed';
        state.movieDetailsError = action.error;
        });
    }});

export { fetchMovieDetailsByIdThunk, fetchMovieCreditsByIdThunk, fetchMovieImagesByIdThunk, fetchMovieReviewsByIdThunk};
export default movieDetailsSlice.reducer;

