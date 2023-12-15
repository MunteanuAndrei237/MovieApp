import { fetchMovieDetailsThunk, fetchMovieCreditsThunk, fetchMovieImagesThunk, fetchMovieReviewsThunk } from '../slices/detailsSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { addMovieCredits, addMovieDetails, addMovieImages, addMovieReviews, addEmptyMovie } from '../slices/loadedSlice';
import { resetDetailsToIdle, resetCreditsToIdle, resetImagesToIdle, resetReviewsToIdle  } from '../slices/detailsSlice';
import '../css/details.css';
const MovieDetailsComponent = () => {

    const dispatch = useDispatch();
    const movieDetailsState = useSelector(state => state.details);
    const loadedMoviesState = useSelector(state => state.loadedMovies);
    const movieId = Number(useParams().movieId);
    useEffect(() => {
        if (loadedMoviesState.loadedMovieIds.indexOf(movieId) === -1) {
            dispatch(addEmptyMovie({ id: movieId }))
            dispatch(fetchMovieDetailsThunk(movieId));
            dispatch(fetchMovieCreditsThunk(movieId));
            dispatch(fetchMovieImagesThunk(movieId));
            dispatch(fetchMovieReviewsThunk(movieId));
        }
        else
            loadedMoviesState.loadedMovies.map((movie) => {
                if (movie.id === movieId) {
                    if (!("details" in movie))
                        dispatch(fetchMovieDetailsThunk(movieId));
                    if (!("credits" in movie))
                        dispatch(fetchMovieCreditsThunk(movieId));
                    if (!("images" in movie))
                        dispatch(fetchMovieImagesThunk(movieId));
                    if (!("reviews" in movie))
                        dispatch(fetchMovieReviewsThunk(movieId));
                }
            })
    }, [dispatch, movieId])
    useEffect(() => {
        if (movieDetailsState.movieDetailsStatus === "succeeded")
            {
                dispatch(addMovieDetails({ details: movieDetailsState.movieDetails, id: movieId }));
                dispatch(resetDetailsToIdle());
            }
    }, [dispatch, movieDetailsState.movieDetailsStatus, movieId]);
    useEffect(() => {
        if (movieDetailsState.movieCreditsStatus === "succeeded")
            {
                dispatch(addMovieCredits({ credits: movieDetailsState.movieCredits, id: movieId }));
                dispatch(resetCreditsToIdle());
            }
    }, [dispatch, movieDetailsState.movieCreditsStatus, movieId]);
    useEffect(() => {
        if (movieDetailsState.movieImagesStatus === "succeeded")
            {
                dispatch(addMovieImages({ images: movieDetailsState.movieImages, id: movieId }));
                dispatch(resetImagesToIdle());
            }
    }, [dispatch, movieDetailsState.movieImagesStatus, movieId]);
    useEffect(() => {
        if (movieDetailsState.movieReviewsStatus === "succeeded")
            {
                dispatch(addMovieReviews({ reviews: movieDetailsState.movieReviews, id: movieId }));
                dispatch(resetReviewsToIdle());
            }
    }, [dispatch, movieDetailsState.movieReviewsStatus, movieId]);
    
    return (
        <div className="movieDetails" key={movieId}>
            {movieDetailsState.movieDetailsStatus === 'loading' ? <p>loading...</p> :
                movieDetailsState.movieDetailsStatus === 'failed' ?
                    <div>
                        <h1>We ecnountered an error</h1>
                        <p>{movieDetailsState.movieDetailsError} </p>
                    </div>
                    : 
                        loadedMoviesState.loadedMovies.map((movie) => {
                            if (movie.id === movieId) {
                                console.log(movie)
                                    return (
                                        <div className="movieSpecs" key={movie.id}>
                                        <img className="movieImage" src={"https://image.tmdb.org/t/p/w780/" + movie.poster_path} />
                                        <div>
                                        <p>Budget:{movie.budget}</p>
                                        </div>
                                        </div>
                                    )
                            }
                        }) }
            {movieDetailsState.movieCreditsStatus === 'loading' ? <p>loading...</p> :
                movieDetailsState.movieCreditsStatus === 'failed' ?
                    <div>
                        <h1>We ecnountered an error</h1>
                        <p>{movieDetailsState.movieCreditsError} </p>
                    </div>
                    : 
                        loadedMoviesState.loadedMovies.map((movie) => {
                            if (movie.id === movieId && "credits" in movie) {
                                return (
                                  <div className="castContainer">
                                    {movie.credits.map((credit) => (
                                      <div key={credit.id}>
                                        <img className="castImage" src={"https://image.tmdb.org/t/p/w780/" + credit.profile_path} alt={credit.name} />
                                        <h4>{credit.name}</h4>
                                        <p>{credit.character}</p>
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                        }) }
            {movieDetailsState.movieImagesStatus === 'loading' ? <p>loading...</p> :
                movieDetailsState.movieImagesStatus === 'failed' ?
                    <div>
                        <h1>We ecnountered an error</h1>
                        <p>{movieDetailsState.movieImagesError} </p>
                    </div>
                    : 
                        loadedMoviesState.loadedMovies.map((movie) => {
                            if (movie.id === movieId && "images" in movie) {
                                
                                    return movie.images.map((image) => {
                                        return <div key={image.file_path}>
                                            <img  src={"https://image.tmdb.org/t/p/w780/" + image.file_path} alt="Media not avalabile" />
                                        </div>
                                    })
                            }
                        }) }
            {movieDetailsState.movieReviewsStatus === 'loading' ? <p>loading...</p> :
                movieDetailsState.movieReviewsStatus === 'failed' ?
                    <div>
                        <h1>We ecnountered an error</h1>
                        <p>{movieDetailsState.movieReviewsError} </p>
                    </div>
                    : 
                        loadedMoviesState.loadedMovies.map((movie) => {
                            if (movie.id === movieId && "reviews" in movie) {
                                return  movie.reviews.map((review) => {
                                        return (
                                            <div key={review.id}>
                                                <p>{review.author}</p>
                                                <p>{review.content}</p>
                                            </div>
                                        )
                                    })
                            }
                        }) }
        </div>
    )
}


export default MovieDetailsComponent;