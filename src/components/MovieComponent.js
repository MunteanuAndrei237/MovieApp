import { fetchDetailsThunk } from '../slices/detailsSlice';
import { fetchPhotosThunk } from '../slices/photosSlice.js';
import { fetchCastThunk } from '../slices/castSlice.js';
import { fetchReviewsThunk } from '../slices/reviewsSlice.js';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {addEmptyMovie } from '../slices/loadedSlice';
import  DetailsComponent  from './DetailsComponent';
import CastComponent from './CastComponent';
import PhotosComponent from './PhotosComponent.js';
import ReviewsComponent from './ReviewsComponent.js';
import '../css/movie.css';
const MovieComponent = () => {

    const dispatch = useDispatch();
    const loadedState = useSelector(state => state.loaded);
    const movieId = Number(useParams().movieId);
    useEffect(() => {
        if (loadedState.loadedMovieIds.indexOf(movieId) === -1) 
           { 
            dispatch(addEmptyMovie({ id: movieId }))
            dispatch(fetchDetailsThunk(movieId));
            dispatch(fetchCastThunk(movieId));
            dispatch(fetchPhotosThunk(movieId));
            dispatch(fetchReviewsThunk(movieId));
            }
        else
            loadedState.loadedMovies.map((movie) => {
                if (movie.id === movieId) {
                    if (movie.detailsFetched!==true)
                        dispatch(fetchDetailsThunk(movieId));
                    if (!("cast" in movie))
                        dispatch(fetchCastThunk(movieId));
                    if (!("images" in movie))
                        dispatch(fetchPhotosThunk(movieId));
                    if (!("reviews" in movie))
                        dispatch(fetchReviewsThunk(movieId));
                }
            })
    }, [dispatch, movieId])
  
    return (
        <div className="movieDetails" key={movieId}>
            <DetailsComponent movieId={movieId} />
            <CastComponent movieId={movieId} />
            <PhotosComponent movieId={movieId} />
            <ReviewsComponent movieId={movieId} />
        </div>
    )
}


export default MovieComponent;