import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const fetch = require('node-fetch');

const fetchMovieCreditsThunk = createAsyncThunk('details/fetchMovieCredits', async (movieId) => {
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
const fetchMovieImagesThunk = createAsyncThunk('details/fetchMovieImages', async (movieId) => {
    try{
        const url = 'https://api.themoviedb.org/3/movie/'+movieId+'/images';
        const options = getOptions;
        const response = await fetch(url, options)
        const json = await response.json();
        return json.backdrops;
    }
    catch(error){
        console.error('Error fetching images. ', error);
        throw new Error('Error fetching images. ' + error);
    }
});
const fetchMovieReviewsThunk = createAsyncThunk('details/fetchMovieReviews', async (movieId) => {
    try{
        const url = 'https://api.themoviedb.org/3/movie/'+movieId+'/reviews';
        const options = getOptions;
        const response = await fetch(url, options)
        const json = await response.json();
        return json;
    }
    catch(error){
        console.error('Error fetching reviews. ', error);
        throw new Error('Error fetching reviews. ' + error);
    }
});
const fetchMovieDetailsThunk = createAsyncThunk('details/fetchMoovieDetails', async (movieId) => {
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
        movieDetails: {},
        movieDetailsStatus: 'idle',
        movieDetailsError: null,
        movieCredits: [],
        movieCreditsStatus: 'idle',
        movieCreditsError: null,
        movieImages: [],
        movieImagesStatus: 'idle',
        movieImagesError: null,
        movieReviews: [],
        movieReviewsStatus: 'idle',
        movieReviewsError: null
    },
    reducers: {
        resetDetailsToIdle(state) {
        state.movieDetailsStatus = 'idle';
        state.movieDetails = {};
        },
        resetCreditsToIdle(state) {
        state.movieCreditsStatus = 'idle';
        state.movieCredits = [];
        },
        resetImagesToIdle(state) {
        state.movieImagesStatus = 'idle';
        state.movieImages = [];
        },
        resetReviewsToIdle(state) {
        state.movieReviewsStatus = 'idle';
        state.movieReviews = [];
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchMovieCreditsThunk.pending, (state) => {
        state.movieCreditsStatus = 'loading';
        });
        builder.addCase(fetchMovieCreditsThunk.fulfilled, (state, action) => {
        state.movieCreditsStatus = 'succeeded';
        state.movieCredits = action.payload.cast;
        });
        builder.addCase(fetchMovieCreditsThunk.rejected, (state, action) => {
        state.movieCreditsStatus = 'failed';
        state.movieCreditsError = action.error.message;
        });
    
        builder.addCase(fetchMovieImagesThunk.pending, (state) => {
        state.movieImagesStatus = 'loading';
        });
        builder.addCase(fetchMovieImagesThunk.fulfilled, (state, action) => {
        state.movieImagesStatus = 'succeeded';
        state.movieImages = action.payload;
        });
        builder.addCase(fetchMovieImagesThunk.rejected, (state, action) => {
        state.movieImagesStatus = 'failed';
        state.movieImagesError = action.error.message;
        });
    
        builder.addCase(fetchMovieReviewsThunk.pending, (state) => {
        state.movieReviewsStatus = 'loading';
        });
        builder.addCase(fetchMovieReviewsThunk.fulfilled, (state, action) => {
        state.movieReviewsStatus = 'succeeded';
        state.movieReviews = action.payload.results;
        });
        builder.addCase(fetchMovieReviewsThunk.rejected, (state, action) => {
        state.movieReviewsStatus = 'failed';
        state.movieReviewsError = action.error.message;
        });
    
        builder.addCase(fetchMovieDetailsThunk.pending, (state) => {
        state.movieDetailsStatus = 'loading';
        });
        builder.addCase(fetchMovieDetailsThunk.fulfilled, (state, action) => {
        state.movieDetailsStatus = 'succeeded';
        state.movieDetails = action.payload;
        });
        builder.addCase(fetchMovieDetailsThunk.rejected, (state, action) => {
        state.movieDetailsStatus = 'failed';
        state.movieDetailsError = action.error.message;
        });
    }});

export const { resetDetailsToIdle, resetCreditsToIdle, resetImagesToIdle, resetReviewsToIdle } = detailsSlice.actions ;
export { fetchMovieDetailsThunk, fetchMovieCreditsThunk, fetchMovieImagesThunk, fetchMovieReviewsThunk};
export default detailsSlice.reducer;

