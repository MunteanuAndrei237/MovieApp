import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import accessToken from "../accessToken";
const getMoviesByGenreThunk = createAsyncThunk("genre/getMoviesByGenreThunk", async (genreId) => {
const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres='+genreId;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: accessToken
}
};
console.log(genreId);
const response = await fetch(url, options);
const json = await response.json();
return {results : json.results , genreId : genreId};
});

const getGenresThunk = createAsyncThunk("genre/getGenresThunk", async () => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: accessToken
    }
    };
    const response = await fetch(url, options);
    const json = await response.json();
    return json.genres;
});

const genreSlice = createSlice({
    name: "genre",
    initialState: {
        genres: [],
        genresStatus: 'idle',
        genresError: null,
        selectedGenre: 'Search by genre',
        movies:{},
        movieIds:[],
        moviesStatus: 'idle',
        moviesError: null
    },
    reducers: {
        selectGenre(state, action){
            state.selectedGenre = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getGenresThunk.pending, (state) => {
            state.genresStatus = 'loading';
        });
        builder.addCase(getGenresThunk.fulfilled, (state, action) => {
            state.genresStatus = 'succeeded';
            state.genres = action.payload;
            action.payload.forEach(genre => {
            state.movies[genre.id]=[];
            });
        });
        builder.addCase(getGenresThunk.rejected, (state, action) => {
            state.genresStatus = 'failed';
            state.genresError = action.error;
        });


        builder.addCase(getMoviesByGenreThunk.pending, (state) => {
            state.moviesStatus = 'loading';
        });
        builder.addCase(getMoviesByGenreThunk.fulfilled, (state, action) => {
            state.moviesStatus = 'succeeded';

            action.payload.results.forEach(movie => {
            if(state.movies[action.payload.genreId].indexOf(movie.id)===-1)
            {
                state.movies[action.payload.genreId].push(movie);
                state.movieIds.push(movie.id);
            }});
        });
        builder.addCase(getMoviesByGenreThunk.rejected, (state, action) => {
            state.moviesStatus = 'failed';
            state.moviesError = action.error;
        });
    }
});
export const { selectGenre} = genreSlice.actions;
export { getGenresThunk, getMoviesByGenreThunk };
export default genreSlice.reducer;