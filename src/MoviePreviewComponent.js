import { addMovieToFavouritesThunk } from "./slices/favouritesSlice.js";
import { useDispatch , useSelector } from "react-redux";
import { removeFavouritesLocation } from "./slices/loadedMoviesSlice.js";
import { getFavouriteMoviesThunk } from "./slices/favouritesSlice.js";
import { useNavigate } from "react-router-dom";

const MoviePreviewComponent = ({ movie }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const favouritesState = useSelector(state => state.favourites);

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
            {favouritesState.favouritesStatus === 'succeeded' ?
            movie.locations.indexOf("favourites") !== -1 ?
            <button onClick={() => { changeFavouriteState(movie) }}>Remove from favourites</button> 
            :
            <button onClick={() => { changeFavouriteState(movie) }}>Add to favourites</button>
             : favouritesState.favouritesStatus === 'loading' ?
             <button >Loading favourites</button>
             :
            <button >Could't fetch favourites</button>}
            <button onClick={() => { navigate('/movie/'+movie.id) }}>See movie details</button>
            </div>
    )
}

export default MoviePreviewComponent;