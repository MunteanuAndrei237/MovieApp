import { useSelector,useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { addDetails  } from '../slices/loadedSlice';
import { resetDetailsToIdle } from '../slices/detailsSlice';
import  changeFavouriteState  from '../assets/changeFavouriteState.js';
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import '../css/details.css';

const DetailsComponent = ({ movieId }) => {
    const dispatch = useDispatch();
    const detailsState = useSelector(state => state.details);
    const loadedState = useSelector(state => state.loaded);
    const favouritesState = useSelector(state => state.favourites);

    useEffect(() => {
        if (detailsState.detailsStatus === "succeeded")
            {
                dispatch(addDetails({ details: detailsState.details, id: movieId }));
                dispatch(resetDetailsToIdle());
            }
    }, [dispatch, detailsState.detailsStatus, movieId]);

    return (
        detailsState.detailsStatus === 'loading' ? <h1 className='loading'>Loading details<div className="loading-spinner"/></h1> :
        detailsState.detailsStatus === 'failed' ?
            <div className='error'>
                <h1>We ecnountered an error</h1>
                <p>{detailsState.detailsError} </p>
            </div>  :

            loadedState.loadedMovies.map((movie) => {
                if (movie.id === movieId  && movie.detailsFetched === true) {
                    return (
                        <div className="movieSpecs" key={movie.id}>
                            <img className="movieImage" src={movie.poster_path !== null ? "https://image.tmdb.org/t/p/w780/" + movie.poster_path : "/noSource.jpg"} />
                            <div>
                                <div className='titleAndStar'>
                                <h1 className="movieTitle">{movie.title}</h1>
                                {favouritesState.favouritesStatus === 'succeeded' ?
                                movie.locations.indexOf("favourites") !== -1 ?
                                <IoIosStar color="yellow" className="reactIcons" onClick={e => { changeFavouriteState(movie,e,dispatch) }}/> :
                                <IoIosStarOutline className="reactIcons"  onClick={e => { changeFavouriteState(movie,e,dispatch) }}/> :
                                <span></span>}
                                </div>
                                <div className="detailsColumn">
                                <h4>{movie.overview}</h4>
                                <p>Duration: {parseInt(movie.runtime/60)} h {movie.runtime%60} m</p>
                                <p>Release date: {movie.release_date}</p>
                                <p>Rating: {movie.vote_average}</p>
                                <p>Budget: {movie.budget} $</p>
                                <p>Revenue: {movie.revenue} $</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            }) 
    )
}
export default DetailsComponent;
