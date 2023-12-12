import {fetchMovieDetailsByIdThunk, fetchMovieCreditsByIdThunk, fetchMovieImagesByIdThunk, fetchMovieReviewsByIdThunk} from './slices/movieDetailsSlice';
import { useParams } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { useEffect } from 'react';
import { addMovieCredits ,addMovieDetails ,addMovieImages ,addMovieReviews , addEmptyMovie} from './slices/loadedMoviesSlice';
const MovieDetailsComponent = () => {

    const dispatch = useDispatch();
    const movieDetailsState = useSelector(state => state.movieDetails);
    const loadedMoviesState = useSelector(state => state.loadedMovies);
    const movieId=Number(useParams().movieId);
        useEffect(() => {
        if(loadedMoviesState.loadedMovieIds.indexOf(movieId) === -1)
            {
            dispatch(addEmptyMovie({id:movieId}))
            dispatch(fetchMovieDetailsByIdThunk(movieId));
            dispatch(fetchMovieCreditsByIdThunk(movieId));
            dispatch(fetchMovieImagesByIdThunk(movieId));
            dispatch(fetchMovieReviewsByIdThunk(movieId));
            }
        else
        loadedMoviesState.loadedMovies.map((movie) => {
            
            if(movie.id === movieId)
            {
                if(!("details" in movie))    
            dispatch(fetchMovieDetailsByIdThunk(movieId));
                if(!("credits" in movie))
            dispatch(fetchMovieCreditsByIdThunk(movieId));
                if(!("images" in movie))
            dispatch(fetchMovieImagesByIdThunk(movieId));
                if(!("reviews" in movie))
            dispatch(fetchMovieReviewsByIdThunk(movieId));
                }
            })
    }, [dispatch,movieId])
    useEffect(() => {
        if(movieDetailsState.movieDetailsStatus === "succeeded")
          {
            dispatch(addMovieDetails({details:movieDetailsState.movieDetails,id:movieId}));
          }
      }, [dispatch,movieDetailsState.movieDetailsStatus,movieId]);
    useEffect(() => {
        if(movieDetailsState.movieCreditsStatus === "succeeded")
          {
            dispatch(addMovieCredits({credits:movieDetailsState.movieCredits,id:movieId}));
          }
      }, [dispatch,movieDetailsState.movieCreditsStatus,movieId]);
    useEffect(() => {
        if(movieDetailsState.movieImagesStatus === "succeeded")
          {
            dispatch(addMovieImages({images:movieDetailsState.movieImages,id:movieId}));
          }
      }, [dispatch,movieDetailsState.movieImagesStatus,movieId]);
    useEffect(() => {
        if(movieDetailsState.movieReviewsStatus === "succeeded")
          {
            dispatch(addMovieReviews({reviews:movieDetailsState.movieReviews,id:movieId}));
          }
      }, [dispatch,movieDetailsState.movieReviewsStatus,movieId]);
    return (
        <div>
            {movieDetailsState.movieDetailsStatus === 'loading' ? <p>loading...</p> :
            movieDetailsState.movieDetailsStatus === 'error' ?
            <div>
                <h1>We ecnountered an error</h1>
                <p>{movieDetailsState.movieDetailsError} </p>
                </div>
            : movieDetailsState.movieDetailsStatus === 'succeeded' ?
            loadedMoviesState.loadedMovies.map((movie) => {
                if(movie.id === movieId)
                {
                    if("details" in movie)
                    return (
                       <p>{movie.details.budget}</p>
                    )}}) : null  }
            {movieDetailsState.movieCreditsStatus === 'loading' ? <p>loading...</p> :
            movieDetailsState.movieCreditsStatus === 'error' ?
            <div>
                <h1>We ecnountered an error</h1>
                <p>{movieDetailsState.movieCreditsError} </p>
                </div>
            : movieDetailsState.movieCreditsStatus === 'succeeded' ?
            loadedMoviesState.loadedMovies.map((movie) => {
                if(movie.id === movieId)
                {
                    if("credits" in movie)
                    return movie.credits.map((credit) => {
                        return (
                            <div key={credit.name}>
                           <p>{credit.name}</p>
                           <img src={"https://image.tmdb.org/t/p/w92/"+credit.profile_path}/>
                           </div>
                        )})
                    }}) : null  }
            {movieDetailsState.movieImagesStatus === 'loading' ? <p>loading...</p> :
            movieDetailsState.movieImagesStatus === 'error' ?
            <div>
                <h1>We ecnountered an error</h1>
                <p>{movieDetailsState.movieImagesError} </p>
                </div>
            : movieDetailsState.movieImagesStatus === 'succeeded' ?
            loadedMoviesState.loadedMovies.map((movie) => {
                if(movie.id === movieId)
                {
                    if("images" in movie)
                    return movie.images.map((image) => {
                       return <div>
                           <img key={image.file_path}src={"https://image.tmdb.org/t/p/w92/"+image}   alt="Media not avalabile"/>
                           </div>
                        })
                    }}) : null }
            {movieDetailsState.movieReviewsStatus === 'loading' ? <p>loading...</p> :
            movieDetailsState.movieReviewsStatus === 'error' ?
            <div>
                <h1>We ecnountered an error</h1>
                <p>{movieDetailsState.movieReviewsError} </p>
                </div>
            : movieDetailsState.movieReviewsStatus === 'succeeded' ?
            loadedMoviesState.loadedMovies.map((movie) => {
                if(movie.id === movieId)
                {
                    if("reviews" in movie)
                    return movie.reviews.map((review) => {
                        return (
                           <div key={review.content}>
                           <p>{review.author}</p>
                           <p>{review.content}</p>
                           </div>
                        )})
                    }}) : null } 
            </div>
                    )
                }
    

export default MovieDetailsComponent;