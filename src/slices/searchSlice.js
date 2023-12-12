import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../accessToken";

const getMoviesByTermThunk = createAsyncThunk("/search/getMoviesByTermThunk", async ( term ) => {
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
      return data;
    }
    catch(error){
      console.error('Error searching:', error.message);
      throw error;
    }
  });

const searchSlice = createSlice({   
    name: "search",
    initialState: {
        searchTerm:'',
        searchStatus: 'idle',
        searchError: null,
        searchMovies:[]
    },
    reducers: {
        changeSearchTerm(state, action){
            state.searchTerm = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getMoviesByTermThunk.pending, (state) => {
            state.searchStatus = 'loading';
        });
        builder.addCase(getMoviesByTermThunk.fulfilled, (state, action) => {
            state.searchStatus = 'succeeded';
            state.searchMovies = action.payload.results;
        });
        builder.addCase(getMoviesByTermThunk.rejected, (state, action) => {
            state.searchStatus = 'failed';
            state.searchError = action.error.message;
        });
    }
});
export const { changeSearchTerm } = searchSlice.actions;
export { getMoviesByTermThunk};
export default searchSlice.reducer;