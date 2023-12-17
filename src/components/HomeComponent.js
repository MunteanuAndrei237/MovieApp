import Grid from "./GridComponent.js";
import { useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomeMoviesThunk } from "../slices/homeSlice.js";
import { addMovieToLocation } from "../slices/loadedSlice.js";
import { resetHomeToIdle } from "../slices/homeSlice.js";

const HomeComponent = forwardRef((_, requestMoreFunctionRef) => {
  const dispatch = useDispatch();
  const homeSliceState = useSelector((state) => state.home);

  //fetch home movies
  useEffect(() => {
    if (homeSliceState.homePage === 1) dispatch(fetchHomeMoviesThunk());
  }, [dispatch, homeSliceState.homePage]);

  //if home movies were fetched, add them to loaded movies state
  useEffect(() => {
    if (homeSliceState.homeStatus === "succeeded") {
      dispatch(
        addMovieToLocation({
          movies: homeSliceState.homeMovies,
          location: "home",
        }),
      );
      dispatch(resetHomeToIdle());
    }
  }, [dispatch, homeSliceState.homeStatus, homeSliceState.homeMovies]);

  //modify the scrollingRef to a function that fetches more home movies, then reset it to null when component unmounts
  useEffect(() => {
    requestMoreFunctionRef.current = () => {
      if (
        homeSliceState.homeStatus !== "failed" &&
        homeSliceState.homePage <= homeSliceState.homeTotalPages
      )
        dispatch(fetchHomeMoviesThunk());
    };
    return () => (requestMoreFunctionRef.current = null);
  }, [
    dispatch,
    homeSliceState.homeStatus,
    homeSliceState.homePage,
    homeSliceState.homeTotalPages,
    requestMoreFunctionRef,
  ]);

  return (
    <div>
      <Grid location={"home"} />
      {homeSliceState.homeStatus === "loading" ? (
        <h1 className="loading">
          Loading movies
          <div className="loading-spinner" />
        </h1>
      ) : homeSliceState.homeStatus === "failed" ? (
        <div className="error">
          <h1>We encountered an error</h1>
          <p>{homeSliceState.homeError}</p>
        </div>
      ) : null}
    </div>
  );
});

export default HomeComponent;
