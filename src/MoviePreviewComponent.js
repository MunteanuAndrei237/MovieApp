import { addMovieToFavouritesThunk } from "./slices/loadedMoviesSlice.js";
import { useDispatch , useSelector } from "react-redux";
import { getFavouriteMoviesThunk , removeFavouritesLocation } from "./slices/loadedMoviesSlice.js";
import { useNavigate } from "react-router-dom";

const MoviePreviewComponent = ({ movie }) => {
    const dispatch = useDispatch();
    const loadedMoviesState = useSelector(state => state.loadedMovies);

    function changeFavouriteState(movie)
    {
        dispatch(addMovieToFavouritesThunk({ movieId: movie.id,favouriteState:movie.locations.indexOf("favourites") !== -1}))
        .then(()=>{dispatch(getFavouriteMoviesThunk())})
        .then(()=>dispatch(removeFavouritesLocation(movie.id)))
    }
    

    return (
        <div onClick={() => {/*navigate('/movie/'+movie.id)*/}  }>
            <p>{movie.title}</p> 
            <img src={"https://image.tmdb.org/t/p/w92" + movie.poster_path} />
            <p>Release date {movie.release_date}</p><p>Vote average {movie.vote_average}</p>
            {loadedMoviesState.favouritesStatus === 'succeeded' ?
            movie.locations.indexOf("favourites") !== -1 ?
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