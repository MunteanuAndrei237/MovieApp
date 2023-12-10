import {fetchMovieDetailsByIdThunk, fetchMovieCreditsByIdThunk, fetchMovieImagesByIdThunk, fetchMovieReviewsByIdThunk} from './slices/movieDetailsSlice';
import { useParams } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { useEffect } from 'react';
const MovieDetailsComponent = () => {

    const dispatch = useDispatch();
    const movieDetailsState = useSelector(state => state.movieDetails);
    const movieId=useParams().movieId;

    useEffect(() => {
        
        dispatch(fetchMovieDetailsByIdThunk(movieId));
        dispatch(fetchMovieCreditsByIdThunk(movieId));
        dispatch(fetchMovieImagesByIdThunk(movieId));
        dispatch(fetchMovieReviewsByIdThunk(movieId));
    }, [dispatch])
    
    return (
        <div>
            <p>salut</p>
        </div>
    )
}

export default MovieDetailsComponent;