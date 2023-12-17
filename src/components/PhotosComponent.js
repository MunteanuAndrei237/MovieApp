import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPhotos } from "../slices/loadedSlice";
import { resetPhotosToIdle } from "../slices/photosSlice";
import { showMorePhotos } from "../slices/photosSlice";
import '../css/photos.css';

const PhotosComponent = ({ movieId }) => {
    const dispatch = useDispatch();
    const photosState = useSelector(state => state.photos);
    const loadedState = useSelector(state => state.loaded);

    useEffect(() => {
        if (photosState.photosStatus === "succeeded") {

            dispatch(addPhotos({ photos: photosState.photos, id: movieId }));
            dispatch(resetPhotosToIdle());
        }
    }, [dispatch, photosState.photosStatus, movieId]);

    return (
        <div>
            <h2 className="detailsSubTitle">Photos</h2>
        {photosState.photosStatus === 'loading' ? <h1 className="loading">Loading phots<div className="loading-spinner"/></h1> :
            photosState.photosStatus === 'failed' ?
                <div className="error">
                    <h1>We ecnountered an error</h1>
                    <p>{photosState.photosError} </p>
                </div>
                :
                    loadedState.loadedMovies.map((movie) => {
                        if (movie.id === movieId && "photos" in movie) {
                            return (
                                <div key={movieId}>
                                    {movie.photos.length === 0 ?
                                        <h3 style={{ textAlign: "center" }}>This movie has no photos</h3>
                                        :
                                        <div>
                                            <div className="photosGrid">
                                                {movie.photos.slice(0, photosState.photosLoaded).map((photo) => {
                                                    return <div key={photo.file_path}>

                                                        <img className="photo" src={"https://image.tmdb.org/t/p/w500/" + photo.file_path} alt="Media not available" />
                                                    </div>
                                                })}
                                            </div>
                                            {movie.photos.length > photosState.photosLoaded ? (
                                                <h3 className="showMore" onClick={() => dispatch(showMorePhotos(window.innerWidth < 767 ? 2 : 4))}>
                                                    Show more
                                                </h3>
                                            ) : null}
                                        </div>
                                    }
                                </div>
                            );
                        }
                    })}

                </div>
    )
};

export default PhotosComponent;