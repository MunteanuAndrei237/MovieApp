import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../accessToken";
const fetch = require('node-fetch');

const fetchMovieDetailsByIdThunk = createAsyncThunk('home/fetchMoovieDetailsById', async ({ id }) => {
  const moovieDetailsUrl = 'https://api.themoviedb.org/3/movie/';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: accessToken
    }
  };
  try {
    const response = await fetch(moovieDetailsUrl + id, options);
    const data = await response.json();
    return { ...data, detailsFetched: true };
  } catch (error) {
    console.error('error:', error);
    throw error;
  }
});

const fetchHomeMoviesThunk = createAsyncThunk('home/fetchHomeMovies', async (_, { getState }) => {
  const homeMoviesUrl = 'https://api.themoviedb.org/3/movie/popular';
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
    const newData = data.results.map(movie => {
      return { ...movie, inFavourites: true }
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

    const url = 'https://api.themoviedb.org/3/account/' + getState().user.user.id + '/favorite';
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
})

const loadedMoviesSlice = createSlice({
  name: 'loadedMovies',
  initialState: {
    favouritesStatus: 'idle',
    homeStatus: 'idle',
    homeError: null,
    favouritesError: null,
    loadedMovies: [],
    favouriteIds: [],
    loadedMovieIds:[]
  },
  reducers: {
    changeFavouriteStateReducer(state, action) {
      state.loadedMovies = state.loadedMovies.map(movie => movie.id !== action.payload ?  movie : {...movie, inFavourites: !movie.inFavourites});
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchHomeMoviesThunk.pending, (state) => {
      state.homeStatus = 'loading';
    });
    builder.addCase(fetchHomeMoviesThunk.fulfilled, (state, action) => {
      state.homeStatus = 'succeeded';
      action.payload.forEach(movie => {
        if(state.loadedMovieIds.indexOf(movie.id)===-1)
        {
          if(state.favouriteIds.indexOf(movie.id)===-1)
        state.loadedMovies.push({ ...movie, inHome: true, inFavourites: false});
          else
        state.loadedMovies.push({ ...movie, inHome: true, inFavourites: true });
        state.loadedMovieIds.push(movie.id);
        }
      });
      //state.loadedMovies = [...state.loadedMovies, ...action.payload];
    });
    builder.addCase(fetchHomeMoviesThunk.rejected, (state) => {
      state.homeStatus = 'failed';
      state.homeError = 'We encountered an error';
    });



    builder.addCase(getFavouriteMoviesThunk.pending, (state) => {
      state.favouritesStatus = 'loading';
    });
    builder.addCase(getFavouriteMoviesThunk.fulfilled, (state, action) => {
      
      state.favouritesStatus = 'succeeded';
      //state.loadedMovies = [...state.loadedMovies, ...action.payload];
      action.payload.forEach(movie => {
        if(state.favouriteIds.indexOf(movie.id)===-1)
        state.favouriteIds.push(movie.id);
      })
    });
    builder.addCase(getFavouriteMoviesThunk.rejected, (state, action) => {
      state.favouritesStatus = 'failed';
      state.favouritesError = action.error;
    });

  }
});

export const { changeFavouriteStateReducer } = loadedMoviesSlice.actions;
export { fetchHomeMoviesThunk, fetchMovieDetailsByIdThunk };
export { getFavouriteMoviesThunk, addMovieToFavouritesThunk };
export default loadedMoviesSlice.reducer;