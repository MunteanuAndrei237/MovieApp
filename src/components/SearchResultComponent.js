import Grid from "./GridComponent.js";
import { useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMoviesByTermThunk } from "../slices/searchSlice.js";
import { addMovieToLocation } from "../slices/loadedSlice.js";
import { resetSearchToIdle } from "../slices/searchSlice.js";

const SearchResultComponent = forwardRef((_, requestMoreFunctionRef) => {
  const dispatch = useDispatch();
  const searchState = useSelector((state) => state.search);
  const term = useParams().term;

  //fetch movies by term
  useEffect(() => {
    if (searchState.searchPage[term] === undefined)
      dispatch(fetchMoviesByTermThunk(term));
  }, [dispatch, term]);

  //if movies were fetched, add them to loaded movies state
  useEffect(() => {
    if (searchState.searchStatus === "succeeded") {
      dispatch(
        addMovieToLocation({
          movies: searchState.searchMovies,
          location: term,
          useTerm: true,
        }),
      );
      dispatch(resetSearchToIdle());
    }
  }, [searchState.searchStatus]);

  //modify the scrollingRef to a function that fetches more movies by term, then reset it to null when component unmounts
  useEffect(() => {
    requestMoreFunctionRef.current = () => {
      if (
        searchState.searchStatus !== "failed" &&
        (searchState.searchTotalPages[term] === undefined ||
          searchState.searchPage[term] <= searchState.searchTotalPages[term])
      )
        dispatch(fetchMoviesByTermThunk(term));
    };
    return () => (requestMoreFunctionRef.current = null);
  }, [dispatch, term, searchState.searchStatus]);

  return (
    <div>
      <Grid location={"term=" + term} />
      {searchState.searchStatus === "loading" ? (
        <h1 className="loading">Loading movies</h1>
      ) : searchState.searchStatus === "failed" ? (
        <div className="error">
          <h1>We ecnountered an error</h1>
          <p>{searchState.searchError} </p>
        </div>
      ) : null}
    </div>
  );
});

export default SearchResultComponent;
