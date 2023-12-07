import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../accessToken";

const getMoviesByTermThunk = createAsyncThunk("/search/getMoviesByTermThunk", async ( term ,{ getState }) => {
    try{
  const url = 'https://api.themoviedb.org/3/search/movie?query='+ term +'&include_adult=false&language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: accessToken
    }
  };
      const response = await fetch(url, options);
      const data = await response.json();
      const favouriteIds = getState().loadedMovies.favouriteIds;
      const newData=data.results.map(movie => {
        if(favouriteIds.indexOf(movie.id)===-1)
        return { ...movie, inFavourites: false }
        else
        return { ...movie, inFavourites: true }
      });
      return newData;
    }
    catch(error){
      console.error('Error searching:', error.message);
      throw error;
    }
  });

const searchSlice = createSlice({   
    name: "search",
    initialState: {
        searchTerm: '',
        movies: [],
        status: 'idle',
        error: null
    },
    reducers: {
        changeSearchTerm(state, action){
            state.searchTerm = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getMoviesByTermThunk.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getMoviesByTermThunk.fulfilled, (state, action) => {
          console.log(action.payload)
            state.status = 'succeeded';
            state.movies = action.payload;
        });
        builder.addCase(getMoviesByTermThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    }
});
export const { changeSearchTerm } = searchSlice.actions;
export { getMoviesByTermThunk};
export default searchSlice.reducer;