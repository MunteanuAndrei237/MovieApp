import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { useSelector } from "react-redux";
import '../css/grid.css';

const Grid = ({location}) => {
    const movies = useSelector(state => state.loadedMovies.loadedMovies);
    return (
        <div className="moviesGrid">
            {movies.map((movie) => {
                if (movie.locations.indexOf(location) !== -1) {
                    return <MoviePreviewComponent movie={movie} key={movie.id} />;
                }
            })}
        </div>
    )
}

export default Grid;