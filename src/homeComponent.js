import { useEffect } from "react";
import { fetchHomeMoviesThunk  } from './slices/homeSlice.js';
import { useSelector, useDispatch } from "react-redux";
import { addLoadedMovie } from "./slices/loadedMoviesSlice.js";
import MoviePreviewComponent from "./MoviePreviewComponent.js";

const HomeComponent = () => {


  const homeSliceState = useSelector(state => state.home);
  const loadedMoviesState = useSelector(state => state.loadedMovies);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchHomeMoviesThunk(1));
  }, [dispatch]);

  useEffect(() => {
    if(homeSliceState.homeStatus === "succeeded")
      {
        dispatch(addLoadedMovie({movies:homeSliceState.homeMovies,location:"home"}));
      }
  }, [dispatch,homeSliceState.homeStatus]);


  return (
    <div>
    {loadedMoviesState.loadedMovies.map((movie) => {
      
      if(movie.locations.indexOf("home") !== -1)
        return <MoviePreviewComponent movie={movie} key={movie.id}/>  
        }
      )
      }
    {homeSliceState.homeStatus === 'loading' ? <p>loading...</p> : 
    homeSliceState.homeStatus === 'error' ? <div><h1>We ecnountered an error</h1><p>{homeSliceState.homeError} </p></div> :
    null}
      
   </div>
  );
}

export default HomeComponent;