//component that fetches and displays details of a movie
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";
import { addDetails } from "../slices/loadedSlice";
import { fetchDetailsThunk, resetDetailsToIdle } from "../slices/detailsSlice";
import changeFavouriteState from "../assets/changeFavouriteState.js";
import "../css/details.css";

const DetailsComponent = ({ movieId }) => {
  const dispatch = useDispatch();
  const detailsState = useSelector((state) => state.details);
  const loadedState = useSelector((state) => state.loaded);
  const favouritesState = useSelector((state) => state.favourites);

  //fetch movie details if they were not fetched
  useEffect(() => {
    if (
      movieId in loadedState.loadedMovies &&
      loadedState.loadedMovies[movieId].detailsFetched !== true
    )
      dispatch(fetchDetailsThunk(movieId));
  }, [dispatch, movieId, loadedState.loadedMovies]);

  //if details were fetched, add them to loaded movies state
  useEffect(() => {
    if (detailsState.detailsStatus === "succeeded") {
      dispatch(addDetails({ details: detailsState.details, id: movieId }));
      dispatch(resetDetailsToIdle());
    }
  }, [dispatch, detailsState.detailsStatus, detailsState.details, movieId]);

  return detailsState.detailsStatus === "loading" ? (
    <h1 className="loading">
      Loading details
      <div className="loading-spinner" />
    </h1>
  ) : detailsState.detailsStatus === "failed" ? (
    <div className="error">
      <h1>We ecnountered an error</h1>
      <p>{detailsState.detailsError} </p>
    </div>
  ) : loadedState.loadedMovies[movieId] !== undefined &&
    loadedState.loadedMovies[movieId].detailsFetched ? (
    <div className="movieSpecs" key={loadedState.loadedMovies[movieId].id}>
      <img
        className="movieImage"
        src={
          loadedState.loadedMovies[movieId].poster_path !== null
            ? "https://image.tmdb.org/t/p/w780/" +
              loadedState.loadedMovies[movieId].poster_path
            : "/noSource.jpg"
        }
        alt="Media unavalabile"
      />
      <div>
        <div className="titleAndStar">
          <h1 className="movieTitle">
            {loadedState.loadedMovies[movieId].title}
          </h1>
          {favouritesState.favouritesStatus === "succeeded" ? (
            loadedState.loadedMovies[movieId].locations.indexOf(
              "favourites",
            ) !== -1 ? (
              <IoIosStar
                color="yellow"
                className="reactIcons"
                onClick={(e) => {
                  changeFavouriteState(
                    loadedState.loadedMovies[movieId],
                    e,
                    dispatch,
                  );
                }}
              />
            ) : (
              <IoIosStarOutline
                className="reactIcons"
                onClick={(e) => {
                  changeFavouriteState(
                    loadedState.loadedMovies[movieId],
                    e,
                    dispatch,
                  );
                }}
              />
            )
          ) : (
            <span></span>
          )}
        </div>
        <div className="detailsColumn">
          <h4>{loadedState.loadedMovies[movieId].overview}</h4>
          <p>
            Duration: {parseInt(loadedState.loadedMovies[movieId].runtime / 60)}{" "}
            h {loadedState.loadedMovies[movieId].runtime % 60} m
          </p>
          <p>Release date: {loadedState.loadedMovies[movieId].release_date}</p>
          <p>Rating: {loadedState.loadedMovies[movieId].vote_average}</p>
          <p>Budget: {loadedState.loadedMovies[movieId].budget} $</p>
          <p>Revenue: {loadedState.loadedMovies[movieId].revenue} $</p>
        </div>
      </div>
    </div>
  ) : null;
};
export default DetailsComponent;
