import { addMovieToFavouritesThunk } from "./slices/favouriteSlice.js";
import { useDispatch , useSelector } from "react-redux";
import { addToFavouritesReducer , removeFromFavouritesReducer } from "./slices/favouriteSlice.js";
import { changeInFavouritesReducer } from "./slices/homeSlice.js";

const MoviePreviewComponent = ({ movie }) => {

    const dispatch = useDispatch();
    const favouriteMoviesState = useSelector(state => state.favourite);

    function changeFavouriteState(movie)
    {
        
        if(movie.inFavourites === true)
        dispatch(removeFromFavouritesReducer(movie.id));
        else
        dispatch(addToFavouritesReducer(movie));

        dispatch(addMovieToFavouritesThunk({ movieId: movie.id,favouriteState:movie.inFavourites}))
        dispatch(changeInFavouritesReducer(movie.id));
    }

    return (
        <div><p>{movie.title}</p> <img src={"https://image.tmdb.org/t/p/w92" + movie.poster_path} />
            <p>Release date {movie.release_date}</p><p>Vote average {movie.vote_average}</p>
            {favouriteMoviesState.status === 'succeeded' ?
            movie.inFavourites === true ?
            <button onClick={() => { changeFavouriteState(movie) }}>Remove from favourites</button>
            :
            <button onClick={() => { changeFavouriteState(movie) }}>Add to favourites</button>
             : favouriteMoviesState.status === 'loading' ?
             <button >Loading favourites</button>
             :
            <button >Could't fetch favourites</button>}
            </div>
    )
}

export default MoviePreviewComponent;