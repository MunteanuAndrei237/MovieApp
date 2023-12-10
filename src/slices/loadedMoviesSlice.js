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
    

    return data.results;
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
    console.log(favouriteState);
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
    loadedMovieIds:[]
  },
  reducers: {
      removeFavouritesLocation(state, action){
        state.loadedMovies.forEach(loadedMovie => {
          if(loadedMovie.id === action.payload)
          {
            loadedMovie.locations=loadedMovie.locations.filter(location => location !== "favourites");
          }
      })
    }
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
              state.loadedMovies.push({ ...movie, locations: ["home"]});
              state.loadedMovieIds.push(movie.id);
            }
        else
        {
          state.loadedMovies.forEach(loadedMovie => {
            if(loadedMovie.id === movie.id && loadedMovie.locations.indexOf("home") === -1)
            {
              loadedMovie.locations.push("home");
            }
          })
        }
      })
      
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
      action.payload.forEach(movie => {
        if(state.loadedMovieIds.indexOf(movie.id)===-1)
            {
              state.loadedMovies.push({ ...movie, locations: ["favourites"]});
              state.loadedMovieIds.push(movie.id);
            }
        else
        {
          state.loadedMovies.forEach(loadedMovie => {
            if(loadedMovie.id === movie.id && loadedMovie.locations.indexOf("favourites") === -1)
            {
              loadedMovie.locations.push("favourites");
            }
          })
        }
      })
    });
    builder.addCase(getFavouriteMoviesThunk.rejected, (state, action) => {
      state.favouritesStatus = 'failed';
      state.favouritesError = action.error;
    });

  }
});
export const {removeFavouritesLocation} = loadedMoviesSlice.actions;
export { fetchHomeMoviesThunk, fetchMovieDetailsByIdThunk };
export { getFavouriteMoviesThunk, addMovieToFavouritesThunk };
export default loadedMoviesSlice.reducer;