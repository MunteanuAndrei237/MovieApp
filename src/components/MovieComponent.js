//component that displays an individual movie with all its details (/movie/:id)
import DetailsComponent from "./DetailsComponent";
import CastComponent from "./CastComponent";
import PhotosComponent from "./PhotosComponent.js";
import ReviewsComponent from "./ReviewsComponent.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addEmptyMovie } from "../slices/loadedSlice";
import "../css/movie.css";

const MovieComponent = () => {
  const dispatch = useDispatch();
  const loadedState = useSelector((state) => state.loaded);
  const movieId = Number(useParams().movieId);

  //if movie is not loaded, add it to loaded movies state
  useEffect(() => {
    if (!(movieId in loadedState.loadedMovies))
      dispatch(addEmptyMovie({ id: movieId }));
  }, [dispatch, movieId]);

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
