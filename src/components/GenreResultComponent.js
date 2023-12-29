//component that renders the grid component with the movies of selected genre(/genres/:genreId)
import Grid from "./GridComponent.js";
import { useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMoviesByGenreThunk, selectGenre } from "../slices/genresSlice.js";
import { addMovieToLocation } from "../slices/loadedSlice.js";
import { resetGenreToIdle } from "../slices/genresSlice.js";

const SearchGenreResultComponent = forwardRef((_, requestMoreFunctionRef) => {
  const dispatch = useDispatch();
  const genreId = useParams().genreId;
  const genresSliceState = useSelector((state) => state.genres);

  //modify the selected genre based on the url parameter
  useEffect(() => {
    dispatch(selectGenre(genreId));
    return () => {
      dispatch(selectGenre("default"));
    };
  }, [dispatch, genreId]);

  //fetch movies by genre when genres are fetched
  useEffect(() => {
    if(genresSliceState.genresStatus === "succeeded")
      if (genresSliceState.genresPage[genreId] === 1)
          dispatch(fetchMoviesByGenreThunk(genreId));
  }, [dispatch, genreId,genresSliceState.genresStatus]);

  //if movies were fetched, add them to loaded movies state
  useEffect(() => {
    if (genresSliceState.moviesStatus === "succeeded") {
      dispatch(
        addMovieToLocation({
          movies: genresSliceState.movies,
          location: genreId,
        }),
      );
      dispatch(resetGenreToIdle());
    }
  }, [dispatch, genresSliceState.moviesStatus]);

  //modify the scrollingRef to a function that fetches more movies by genre, then reset it to null when component unmounts
  useEffect(() => {
    requestMoreFunctionRef.current = () => {
      if (
        genresSliceState.moviesStatus !== "failed" &&
        genresSliceState.genresPage[genreId] <=
          genresSliceState.genresTotalPages[genreId]
      )
        dispatch(fetchMoviesByGenreThunk(genreId));
    };

    return () => (requestMoreFunctionRef.current = null);
  }, [dispatch, genreId, genresSliceState.moviesStatus]);

  return (
    <div>
      <Grid location={genreId} />
      {genresSliceState.moviesStatus === "loading" ? (
        <h1 className="loading">
          Loading movies
          <div className="loading-spinner" />
        </h1>
      ) : genresSliceState.moviesStatus === "failed" ? (
        <div className="error">
          <h1>We ecnountered an error</h1>
          <p>{genresSliceState.moviesError} </p>
        </div>
      ) : null}
    </div>
  );
});

export default SearchGenreResultComponent;
