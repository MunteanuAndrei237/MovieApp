import { useEffect } from "react";
import { fetchHomeMoviesThunk , fetchMovieDetailsByIdThunk } from './slices/homeSlice.js';
import { useSelector, useDispatch } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
const HomeComponent = () => {

  const dispatch = useDispatch();
  const homeMoviesState = useSelector(state => state.home);
  const favouriteMoviesState = useSelector(state => state.favourite);
  useEffect(() => {
    if(favouriteMoviesState.status === "succeeded" || homeMoviesState.status === "rejected")
      dispatch(fetchHomeMoviesThunk());
    
  }, [dispatch,favouriteMoviesState.status]);

  // useEffect(() => {
    
  //   if (homeMoviesState.status === "succeeded") {
  //     homeMoviesState.homeIds.forEach(movie => {
  //       dispatch(fetchMovieDetailsByIdThunk({ id: movie.id, index: movie.index }));
  //     });
  //   }
  // }, [dispatch, homeMoviesState.status ]);

  return (
    homeMoviesState.status === 'loading' ? <p>loading...</p> : homeMoviesState.status === 'error' ? <div><h1>We ecnountered an error</h1><p>homeMoviesState.error </p></div> :
      homeMoviesState.homeMovies.map((movie) => {
        return <MoviePreviewComponent movie={movie} key={movie.id}/>  
      }

      )
  )

}

export default HomeComponent;