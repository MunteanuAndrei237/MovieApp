import { useEffect } from "react";
import { fetchHomeMoviesThunk , fetchMovieDetailsByIdThunk } from './slices/loadedMoviesSlice.js';
import { useSelector, useDispatch } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
const HomeComponent = () => {
  
  const loadedMoviesState = useSelector(state => state.loadedMovies);
  const dispatch = useDispatch();
  useEffect(() => {
    if(loadedMoviesState.favouritesStatus === "succeeded" || loadedMoviesState.favouritesStatus === "rejected")
      dispatch(fetchHomeMoviesThunk());
  }, [dispatch,loadedMoviesState.favouritesStatus]);

  return (
    loadedMoviesState.status === 'loading' ? <p>loading...</p> : 
    loadedMoviesState.status === 'error' ? <div><h1>We ecnountered an error</h1><p>{loadedMoviesState.homeError} </p></div> :
    loadedMoviesState.loadedMovies.map((movie) => {
      if(movie.locations.indexOf("home") !== -1)
        return <MoviePreviewComponent movie={movie} key={movie.id}/>  
      }
      )
  )

}

export default HomeComponent;