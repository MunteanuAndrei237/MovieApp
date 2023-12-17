import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCast } from "../slices/loadedSlice";
import { resetCastToIdle, showMoreCast } from "../slices/castSlice";
import '../css/cast.css';

const CastComponent = ({ movieId }) => {
    const dispatch = useDispatch();
    const castState = useSelector(state => state.cast);
    const loadedState = useSelector(state => state.loaded);

    useEffect(() => {
        if (castState.castStatus === "succeeded") {
            dispatch(addCast({ cast: castState.cast, id: movieId }));
            dispatch(resetCastToIdle());
        }
    }, [dispatch, castState.castStatus, movieId]);

    return (
        <div>
            <h2 className="detailsSubTitle" >Cast</h2>
            {castState.castStatus === 'loading' ? <h1 className="loading">Loading cast<div className="loading-spinner"/></h1> :
                castState.castStatus === 'failed' ?
                    <div className="error">
                        <h1>We encountered an error</h1>
                        <p>{castState.castError} </p>
                    </div>
                    :
                    loadedState.loadedMovies.map((movie) => {
                        if (movie.id === movieId && "cast" in movie) {
                            return (
                                movie.cast.length === 0 ? (
                                    <h3 key="no-cast" style={{ textAlign: "center" }}>Cast unavailable</h3>
                                ) : (
                                    <div key="cast-container">
                                        <div className="castContainer">
                                            {movie.cast.slice(0, castState.castLoaded).map((character) => (
                                                <div key={character.id}>
                                                    <img className="castImage" src={character.profile_path !== null ? "https://image.tmdb.org/t/p/w500/" + character.profile_path : "/nosource.jpg"} alt={character.name} />
                                                    <h4>{character.name}</h4>
                                                    <p>{character.character}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {movie.cast.length > castState.castLoaded ? (
                                            <h3 key="show-more" className="showMore" onClick={() => dispatch(showMoreCast(window.innerWidth < 767 ? 3 : 6))}>
                                                Show more
                                            </h3>
                                        ) : null}
                                    </div>
                                )
                            );
                        }
                    })}
        </div>
    );
}

export default CastComponent;
