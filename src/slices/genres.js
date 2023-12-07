import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import accessToken from "../accessToken";
const getMoviesByGenreThunk = createAsyncThunk("genre/getMoviesByGenreThunk", async (genre) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${genre}?api_key=a9708c7a31d94bf4f964ef44108b2dd3&language=en-US&page=1`);
    const json = await response.json();
    return json;
});

const getGenresThunk = createAsyncThunk("genre/getGenresThunk", async () => {
    console.log("aici")
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

    const newData=json.genres.map((genre) => {
        return genre.name;
    });
    return newData;
});

const genreSlice = createSlice({
    name: "genre",
    initialState: {
        genres: [],
        genresStatus: 'idle',
        genresError: null,
        selectedGenre: '',
        movies:[],
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
        });
        builder.addCase(getGenresThunk.rejected, (state, action) => {
            state.genresStatus = 'failed';
            state.genresError = action.error;
        });
    }
});
export const { selectGenre} = genreSlice.actions;
export { getGenresThunk, getMoviesByGenreThunk };
export default genreSlice.reducer;