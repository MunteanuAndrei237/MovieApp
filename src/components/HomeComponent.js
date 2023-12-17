import { useEffect, useRef } from "react";
import { fetchHomeMoviesThunk } from '../slices/homeSlice.js';
import { useSelector, useDispatch } from "react-redux";
import { addLoadedMovie } from "../slices/loadedSlice.js";
import { isUserNearBottom , loadMoreTimeout } from "../assets/scrolling.js";
import { resetHomeToIdle } from "../slices/homeSlice.js";
import Grid from "./GridComponent.js";
const HomeComponent = () => {
  const homeSliceState = useSelector(state => state.home);
  const dispatch = useDispatch();
  
  const canRequestMoreRef = useRef(true);

  function requestMore() {
    if (homeSliceState.homeStatus !=="failed" && canRequestMoreRef.current && homeSliceState.homePage <= homeSliceState.homeTotalPages) {
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
  }, [handleScroll]);

  useEffect(() => {
    if(homeSliceState.homePage === 1)
    dispatch(fetchHomeMoviesThunk());
  }, [dispatch,homeSliceState.homePage]);

  useEffect(() => {
    if (homeSliceState.homeStatus === "succeeded") {
      dispatch(addLoadedMovie({ movies: homeSliceState.homeMovies, location: "home" }));
      dispatch(resetHomeToIdle());
    }
  }, [dispatch, homeSliceState.homeStatus]);

  return (
    <div>
      <Grid location={"home"}/>
      {homeSliceState.homeStatus === 'loading' ? <h1 className="loading">Loading movies<div className="loading-spinner"/></h1> :
        homeSliceState.homeStatus === 'failed' ? <div className="error"><h1>We encountered an error</h1><p>{homeSliceState.homeError}</p></div> :
          null}

    </div>
  );
}

export default HomeComponent;
