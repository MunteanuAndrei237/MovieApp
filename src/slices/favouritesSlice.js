import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../assets/accessToken";
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
    alert('Error: Couldn\'t ' + (favouriteState === false ? 'add' : 'remove') + ' movie ' + (favouriteState === false ? 'to' : 'from') + ' favourites');
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
    const url = 'https://api.themoviedb.org/3/account/' + getState().user.user.id + '/favorite/movies?language=en-US&page=' + getState().favourites.favouritesPage + '&sort_by=created_at.asc';
    const response = await fetch(url, options);
    const json = await response.json();
    return { results: json.results, totalPages: json.total_pages };
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
})


const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: {
    favouritesStatus: 'idle',
    favouritesError: null,
    favouritesMovies: [],
    favouritesPage: 1,
    favouritsesTotalPages: 1000
  },
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(getFavouriteMoviesThunk.pending, (state) => {
      state.favouritesStatus = 'loading';
    });
    builder.addCase(getFavouriteMoviesThunk.fulfilled, (state, action) => {
      
      state.favouritsesTotalPages = action.payload.totalPages;
      if (state.favouritesPage === state.favouritsesTotalPages)
        state.favouritesStatus = 'succeeded';
      else
        state.favouritesStatus = 'fetchMore';
        state.favouritesMovies = state.favouritesMovies.concat(action.payload.results);
        state.favouritesPage++;
    });
    builder.addCase(getFavouriteMoviesThunk.rejected, (state, action) => {
      state.favouritesStatus = 'failed';
      state.favouritesError = action.error.message;
    });
  }
});

export { addMovieToFavouritesThunk };
export { getFavouriteMoviesThunk };
export default favouritesSlice.reducer;