import { useEffect, useRef } from "react";
import { fetchHomeMoviesThunk } from '../slices/homeSlice.js';
import { useSelector, useDispatch } from "react-redux";
import { addLoadedMovie } from "../slices/loadedSlice.js";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { isUserNearBottom , loadMoreTimeout } from "../assets/scrolling.js";

const HomeComponent = () => {
  const homeSliceState = useSelector(state => state.home);
  const loadedMoviesState = useSelector(state => state.loadedMovies);
  const dispatch = useDispatch();
  
  const canRequestMoreRef = useRef(true);

  function requestMore() {
    if (homeSliceState.homeStatus === "succeeded" && canRequestMoreRef.current) {
      dispatch(fetchHomeMoviesThunk());
      canRequestMoreRef.current = false;
      setTimeout(() => {
        canRequestMoreRef.current = true;
      }, loadMoreTimeout); 
    }
  }

  function handleScroll() {
    if (isUserNearBottom()) {
      requestMore();
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return ()=>{window.removeEventListener('scroll', handleScroll);}
  }, [requestMore]);

  useEffect(() => {
    if(homeSliceState.homePage === 1)
    dispatch(fetchHomeMoviesThunk());
  }, [dispatch,homeSliceState.homePage]);

  useEffect(() => {
    if (homeSliceState.homeStatus === "succeeded") {
      dispatch(addLoadedMovie({ movies: homeSliceState.homeMovies, location: "home" }));
    }
  }, [dispatch, homeSliceState.homeStatus]);

  return (
    <div>
      {loadedMoviesState.loadedMovies.map((movie) => {
        if (movie.locations.indexOf("home") !== -1)
          return <MoviePreviewComponent movie={movie} key={movie.id} />;
      })}
      {homeSliceState.homeStatus === 'loading' ? <p>loading...</p> :
        homeSliceState.homeStatus === 'failed' ? <div><h1>We encountered an error</h1><p>{homeSliceState.homeError}</p></div> :
          null}

    </div>
  );
}

export default HomeComponent;
