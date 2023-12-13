import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import getOptions from "../assets/getOptions";
const getMoviesByGenreThunk = createAsyncThunk("genre/getMoviesByGenreThunk", async (genreId , { getState }) => {
    console.log(getState().genre.genresPage[genreId],genreId);
if(getState().genre.genresPage[genreId] <= getState().genre.genresTotalPages[genreId])
{
const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page='+ getState().genre.genresPage[genreId] + '&sort_by=popularity.desc&with_genres='+genreId;
const options = getOptions;
const response = await fetch(url, options);
const json = await response.json();
if(getState().genre.genresPage[genreId]===1)
return {results:json.results,totalPages:json.total_pages,genreId:genreId};
else
return {results:json.results,genreId:genreId};
}
});

const getGenresThunk = createAsyncThunk("genre/getGenresThunk", async () => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    const options = getOptions;
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
        movies:[],
        moviesStatus: 'idle',
        genresPage:{},
        genresTotalPages: {}
    },
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(getGenresThunk.pending, (state) => {
            state.genresStatus = 'loading';
        });
        builder.addCase(getGenresThunk.fulfilled, (state, action) => {
            state.genresStatus = 'succeeded';
            state.genres = action.payload;
            action.payload.forEach((genre)=>{
                state.genresTotalPages[genre.id]=1000;
                state.genresPage[genre.id]=1;
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
            if(state.genresPage[action.payload.genreId]===1)
                state.genresTotalPages[action.payload.genreId]=action.payload.totalPages;
            state.movies=action.payload.results;
            state.genresPage[action.payload.genreId]++;
        })
        builder.addCase(getMoviesByGenreThunk.rejected, (state, action) => {
            state.moviesStatus = 'failed';
            state.moviesError = action.error;
        });
    }
});

export { getGenresThunk, getMoviesByGenreThunk };
export default genreSlice.reducer;