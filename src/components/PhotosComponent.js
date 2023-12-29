//component that fetches and displays movie photos
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPhotos } from "../slices/loadedSlice";
import {
  fetchPhotosThunk,
  resetPhotosToIdle,
  showMorePhotos,
} from "../slices/photosSlice";
import "../css/photos.css";

const PhotosComponent = ({ movieId }) => {
  const dispatch = useDispatch();
  const photosState = useSelector((state) => state.photos);
  const loadedState = useSelector((state) => state.loaded);

  //fetch movie photos if they were not fetched
  useEffect(() => {
    if (
      movieId in loadedState.loadedMovies &&
      !("photos" in loadedState.loadedMovies[movieId])
    )
      dispatch(fetchPhotosThunk(movieId));
  }, [dispatch, movieId, loadedState.loadedMovies]);

  //if photos were fetched, add them to loaded movies state
  useEffect(() => {
    if (photosState.photosStatus === "succeeded") {
      dispatch(addPhotos({ photos: photosState.photos, id: movieId }));
      dispatch(resetPhotosToIdle());
    }
  }, [dispatch, photosState.photosStatus, movieId, photosState.photos]);

  return (
    <div>
      <h2 className="detailsSubTitle">Photos</h2>
      {photosState.photosStatus === "loading" ? (
        <h1 className="loading">
          Loading photos
          <div className="loading-spinner" />
        </h1>
      ) : photosState.photosStatus === "failed" ? (
        <div className="error">
          <h1>We ecnountered an error</h1>
          <p>{photosState.photosError} </p>
        </div>
      ) : loadedState.loadedMovies[movieId] !== undefined &&
        "photos" in loadedState.loadedMovies[movieId] ? (
        <div key={movieId}>
          {loadedState.loadedMovies[movieId].photos.length === 0 ? (
            <h3 style={{ textAlign: "center" }}>This movie has no photos</h3>
          ) : (
            <div>
              <div className="photosGrid">
                {loadedState.loadedMovies[movieId].photos
                  .slice(0, photosState.photosLoaded)
                  .map((photo) => {
                    return (
                      <div key={photo.file_path}>
                        <img
                          className="photo"
                          src={
                            "https://image.tmdb.org/t/p/w500/" + photo.file_path
                          }
                          alt="Media not available"
                        />
                      </div>
                    );
                  })}
              </div>
              {loadedState.loadedMovies[movieId].photos.length >
              photosState.photosLoaded ? (
                <h3
                  className="showMore"
                  onClick={() =>
                    dispatch(showMorePhotos(window.innerWidth < 767 ? 2 : 4))
                  }
                >
                  Show more
                </h3>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PhotosComponent;
