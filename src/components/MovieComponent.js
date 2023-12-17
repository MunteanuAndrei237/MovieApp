import DetailsComponent from "./DetailsComponent";
import CastComponent from "./CastComponent";
import PhotosComponent from "./PhotosComponent.js";
import ReviewsComponent from "./ReviewsComponent.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDetailsThunk } from "../slices/detailsSlice";
import { fetchPhotosThunk } from "../slices/photosSlice.js";
import { fetchCastThunk } from "../slices/castSlice.js";
import { fetchReviewsThunk } from "../slices/reviewsSlice.js";
import { addEmptyMovie } from "../slices/loadedSlice";

import "../css/movie.css";
const MovieComponent = () => {
  const dispatch = useDispatch();
  const loadedState = useSelector((state) => state.loaded);
  const movieId = Number(useParams().movieId);

  //if movie is not loaded, add it to loaded movies state and fetch its details, cast, photos and reviews
  //if movie is loaded, check if its details, cast, photos and reviews were fetched, if not, fetch them
  useEffect(() => {
    if (loadedState.loadedMovieIds.indexOf(movieId) === -1) {
      dispatch(addEmptyMovie({ id: movieId }));
      dispatch(fetchDetailsThunk(movieId));
      dispatch(fetchCastThunk(movieId));
      dispatch(fetchPhotosThunk(movieId));
      dispatch(fetchReviewsThunk(movieId));
    } else
      loadedState.loadedMovies.forEach((movie) => {
        if (movie.id === movieId) {
          if (movie.detailsFetched !== true)
            dispatch(fetchDetailsThunk(movieId));
          if (!("cast" in movie)) dispatch(fetchCastThunk(movieId));
          if (!("images" in movie)) dispatch(fetchPhotosThunk(movieId));
          if (!("reviews" in movie)) dispatch(fetchReviewsThunk(movieId));
        }
      });
  }, [dispatch, movieId, loadedState.loadedMovieIds, loadedState.loadedMovies]);

  return (
    <div className="movieDetails" key={movieId}>
      <DetailsComponent movieId={movieId} />
      <CastComponent movieId={movieId} />
      <PhotosComponent movieId={movieId} />
      <ReviewsComponent movieId={movieId} />
    </div>
  );
};

export default MovieComponent;
