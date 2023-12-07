import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import fetch from "node-fetch";
import accessToken from "../accessToken";

const getFavouriteMoviesThunk=createAsyncThunk("/favourite/getFavouriteMoviesThunk", async (_, { getState }) => {
    try {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: accessToken
            }
          };
      const url = 'https://api.themoviedb.org/3/account/'+getState().user.user.id+ '/favorite/movies?language=en-US&page=1&sort_by=created_at.asc';
      const response = await fetch(url, options);
      const data = await response.json();
      const newData=data.results.map(movie => {
        return {...movie,  inFavourites: true}
      });
     
      return newData;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  })
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
      
      const url = 'https://api.themoviedb.org/3/account/'+getState().user.user.id+ '/favorite';
      const response = await fetch(url, options);
      const data = await response.json();
      


      return data;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  })
const favouriteSlice = createSlice({
    name: 'favourite',
    initialState: {
        status: 'idle',
        error: null,
        favouriteMovies: [],
        favouriteIds: []
    },
    reducers: {
      addToFavouritesReducer(state, action) {
        state.favouriteMovies.push(action.payload);
      },
      removeFromFavouritesReducer(state, action) {
        state.favouriteMovies = state.favouriteMovies.filter(movie => movie.id !== action.payload);
      },
      
    },
    extraReducers(builder){
        builder.addCase(getFavouriteMoviesThunk.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getFavouriteMoviesThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.favouriteMovies = [...state.favouriteMovies,...action.payload];
            action.payload.forEach(movie => {
            state.favouriteIds.push(movie.id);
            })
        });
        builder.addCase(getFavouriteMoviesThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error;
        });
    }
});

export const {addToFavouritesReducer, removeFromFavouritesReducer } = favouriteSlice.actions;
export {getFavouriteMoviesThunk , addMovieToFavouritesThunk};
export default favouriteSlice.reducer;