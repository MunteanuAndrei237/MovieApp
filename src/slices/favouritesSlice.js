import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../accessToken";
const fetch = require('node-fetch');

const addMovieToFavouritesThunk = createAsyncThunk('favourite/addMovieToFavouritesThunk', async ({ movieId, favouriteState }, { getState }) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: accessToken
        },
        body: JSON.stringify({
          media_type: 'movie',
          media_id: movieId,
          favorite: !favouriteState, // Set to true to mark as favorite, false to remove from favorites
        }),
      };
      const url = 'https://api.themoviedb.org/3/account/' + getState().user.user.id + '/favorite';
      await fetch(url, options);
    } catch (error) {
      alert ('Error: Couldn\'t ' + (favouriteState===false ? 'add' : 'remove') + ' movie ' +  (favouriteState===false ? 'to' : 'from')  + ' favourites');
      console.error('Error:', error.message);
    }
  })

const getFavouriteMoviesThunk = createAsyncThunk("/favourite/getFavouriteMoviesThunk", async (_, { getState }) => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: accessToken
        }
      };
      const url = 'https://api.themoviedb.org/3/account/' + getState().user.user.id + '/favorite/movies?language=en-US&page=1&sort_by=created_at.asc';
      const response = await fetch(url, options);
      const data = await response.json();
      
  
      return data.results;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  })


const loadedMoviesSlice = createSlice({
    name: 'loadedMovies',
    initialState: {
        favouritesStatus: 'idle',
        favouritesError: null,
        favouritesMovies: [],
    },
    reducers: {
    },
    extraReducers(builder){
        builder.addCase(getFavouriteMoviesThunk.pending, (state) => {
        state.favouritesStatus = 'loading';
        });
        builder.addCase(getFavouriteMoviesThunk.fulfilled, (state, action) => {
        state.favouritesStatus = 'succeeded';
        state.favouritesMovies = action.payload;
        });
        builder.addCase(getFavouriteMoviesThunk.rejected, (state) => {
        state.favouritesStatus = 'failed';
        state.favouritesError = 'We encountered an error';
        });
    }
});

export { addMovieToFavouritesThunk };
export { getFavouriteMoviesThunk };
export default loadedMoviesSlice.reducer;