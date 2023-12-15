import { changeFavouriteThunk } from "../slices/favouritesSlice.js";
import { useDispatch , useSelector } from "react-redux";
import { changeFavouritesLocation } from "../slices/loadedSlice.js";
import { useNavigate } from "react-router-dom";
import { IoIosStar, IoIosStarOutline } from 'react-icons/io';
import '../css/preview.css';
const MoviePreviewComponent = ({ movie }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const favouritesState = useSelector(state => state.favourites);

    function changeFavouriteState(movie,event)
    {
        event.stopPropagation();
        dispatch(changeFavouriteThunk({ movieId: movie.id,favouriteState:movie.locations.indexOf("favourites") !== -1}))
        .then(()=>dispatch(changeFavouritesLocation(movie.id)))
    }

    return (
        <div onClick={() => { navigate('/movie/'+movie.id) }}>
            <img className="moviePoster" src={"https://image.tmdb.org/t/p/w780" + movie.poster_path} />
            <div className="titleAndStar">
                <h2 className="movieTitle">{movie.title}</h2> 
                {favouritesState.favouritesStatus === 'succeeded' ?
                movie.locations.indexOf("favourites") !== -1 ?
                <IoIosStar color="yellow" className="reactIcons" onClick={e => { changeFavouriteState(movie,e) }}/> :
                <IoIosStarOutline className="reactIcons"  onClick={e => { changeFavouriteState(movie,e) }}/> :
                <span></span>}
            </div>
            <div className="dateAndAvg">
                <p className="movieDate">Release date<br/> {movie.release_date}</p>
                <h2 className="movieAvg">{parseInt(movie.vote_average*10)+"%"}</h2>
            </div>
        </div>
    )
}

export default MoviePreviewComponent;