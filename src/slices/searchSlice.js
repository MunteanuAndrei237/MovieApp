import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const getMoviesByTermThunk = createAsyncThunk("/search/getMoviesByTermThunk", async ( term , {getState} ) => {
  if(getState().search.searchTotalPages[term]=== undefined || getState().search.searchPage[term] <= getState().search.searchTotalPages[term])
    {
      try{
    const url = 'https://api.themoviedb.org/3/search/movie?query='+ term +'&include_adult=false&language=en-US&page=' + ((getState().search.searchPage[term] === undefined) ? 1 : (getState().search.searchPage[term]));
    const options = getOptions;
      const response = await fetch(url, options);
      const data = await response.json();
      if(getState().search.searchPage[term]=== undefined)
      return {results:data.results,totalPages:data.total_pages,term:term};
    else
      return {results:data.results,term:term}
    }
    catch(error){
      console.error('Error searching:', error.message);
      throw error;
    }
  }});

const searchSlice = createSlice({   
    name: "search",
    initialState: {
        searchTerm:'',
        searchStatus: 'idle',
        searchError: null,
        searchMovies:[],
        searchPage:{},
        searchTotalPages: {}
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
            if(state.searchPage[action.payload.term]=== undefined)
            {
                state.searchTotalPages[action.payload.term] = action.payload.totalPages;
                state.searchMovies = action.payload.results;
                state.searchPage[action.payload.term] = 1;
            }
            else
                state.searchMovies = action.payload.results;
            state.searchPage[action.payload.term]++;
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