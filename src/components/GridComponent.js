//grid component that renders the movies from a certain location in a grid
import PreviewComponent from "./PreviewComponent.js";
import { useSelector } from "react-redux";
import "../css/grid.css";

const Grid = ({ location }) => {
  const movies = useSelector((state) => state.loaded.loadedMovies);
  return (
    <div>
      {Object.values(movies).some(
        (movie) => movie.locations.indexOf(location) !== -1,
      ) ? (
        <div className="moviesGrid">
          {Object.values(movies).map((movie) => {
            if (movie.locations.indexOf(location) !== -1) {
              return <PreviewComponent movie={movie} key={movie.id} />;
            }
            return null;
          })}
        </div>
      ) : (
        <h1 style={{ textAlign: "center", marginTop: "5vh" }}>
          No movies available.
        </h1>
      )}
    </div>
  );
};

export default Grid;
