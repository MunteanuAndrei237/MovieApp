import {createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import accessToken from '../accessToken.js';
const fetch = require('node-fetch');

const homeMoviesUrl = 'https://api.themoviedb.org/3/movie/popular';
const moovieDetailsUrl = 'https://api.themoviedb.org/3/movie/';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: accessToken
  }
};

const fetchMovieDetailsByIdThunk = createAsyncThunk('home/fetchMoovieDetailsById', async ({id}) => {
    try {
      const response = await fetch(moovieDetailsUrl + id, options);
      const data = await response.json();
      return { ...data, detailsFetched:true };
    } catch (error) {
      console.error('error:', error);
      throw error; 
    }
  });

const fetchHomeMoviesThunk = createAsyncThunk('home/fetchHomeMovies', async (_, { getState }) =>
{
    try {
        const response = await fetch(homeMoviesUrl, options);
        const data = await response.json();
        const FavouriteMovieIds=getState().favourite.favouriteIds;
        if(getState().favourite.status === 'succeeded')
        {
          const newData = data.results.map((movie) => {
        if (FavouriteMovieIds.indexOf(movie.id) === -1)
          return {...movie, detailsFetched: false,inHome:true, inFavourites: false};
        else
            return {...movie, detailsFetched: false,inHome:true, inFavourites: true};
        });
        return newData;
      }
      else
      {
        return data.results;
      }
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
        homeMovies:[],
    },
    reducers: {
      changeInFavouritesReducer(state, action) {
        state.homeMovies = state.homeMovies.map(movie => {
          if (movie.id === action.payload)
            {
              console.log(movie);
              return {...movie, inFavourites: !movie.inFavourites};
            }
          else
            return movie;
        });
      }
    },
    extraReducers(builder){
        builder.addCase(fetchHomeMoviesThunk.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchHomeMoviesThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.homeMovies = [...state.homeMovies,...action.payload];
        });
        builder.addCase(fetchHomeMoviesThunk.rejected, (state) => {
            state.status = 'failed';
            state.error = 'We encountered an error';
        });
        // builder.addCase(fetchMovieDetailsByIdThunk.fulfilled, (state, action) => {
        //     state.homeMovies[Number(action.payload.index)]={...state.homeMovies[Number(action.payload.index)],...action.payload}
        // });
    }
});
export const {changeInFavouritesReducer} = homeSlice.actions;
export {fetchHomeMoviesThunk , fetchMovieDetailsByIdThunk};
export default homeSlice.reducer;