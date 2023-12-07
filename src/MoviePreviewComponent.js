import { addMovieToFavouritesThunk } from "./slices/loadedMoviesSlice.js";
import { useDispatch , useSelector } from "react-redux";
import { changeFavouriteStateReducer } from "./slices/loadedMoviesSlice.js";
import { getFavouriteMoviesThunk } from "./slices/loadedMoviesSlice.js";
const MoviePreviewComponent = ({ movie }) => {

    const dispatch = useDispatch();
    const loadedMoviesState = useSelector(state => state.loadedMovies);
    function changeFavouriteState(movie)
    {
        dispatch(addMovieToFavouritesThunk({ movieId: movie.id,favouriteState:movie.inFavourites})).then(()=>dispatch(getFavouriteMoviesThunk()))
        dispatch(changeFavouriteStateReducer(movie.id));
    }

    return (
        <div>
            <p>{movie.title}</p> 
            <img src={"https://image.tmdb.org/t/p/w92" + movie.poster_path} />
            <p>Release date {movie.release_date}</p><p>Vote average {movie.vote_average}</p>
            {loadedMoviesState.favouritesStatus === 'succeeded' ?
            movie.inFavourites === true ?
            <button onClick={() => { changeFavouriteState(movie) }}>Remove from favourites</button> 
            :
            <button onClick={() => { changeFavouriteState(movie) }}>Add to favourites</button>
             : loadedMoviesState.favouritesStatus === 'loading' ?
             <button >Loading favourites</button>
             :
            <button >Could't fetch favourites</button>}
            </div>
    )
}

export default MoviePreviewComponent;