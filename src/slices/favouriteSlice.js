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
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  })
  const addMovieToFavouritesThunk = createAsyncThunk('favourite/addMovieToFavouritesThunk', async (movieId, { getState }) => {
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
            favorite: true, // Set to true to mark as favorite, false to remove from favorites
          }),
      };
      console.log(getState().user.user.id,movieId);
      const url = 'https://api.themoviedb.org/3/account/'+getState().user.user.id+ '/favorite';
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("data",data);
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
        favouriteMovies: []
    },
    reducers: {

    },
    extraReducers(builder){
        builder.addCase(getFavouriteMoviesThunk.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getFavouriteMoviesThunk.fulfilled, (state, action) => {
            console.log(action.payload)
            state.status = 'succeeded';
            state.favouriteMovies = action.payload;
        });
        builder.addCase(getFavouriteMoviesThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error;
        });
    }
});

export {getFavouriteMoviesThunk , addMovieToFavouritesThunk};
export default favouriteSlice.reducer;