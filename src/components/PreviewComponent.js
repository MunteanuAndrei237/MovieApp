//component that shows a preview of a movie , used in the grid component
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import changeFavouriteState from "../assets/changeFavouriteState.js";
import "../css/preview.css";

const PreviewComponent = ({ movie }) => {
  const dispatch = useDispatch();
  const favouritesState = useSelector((state) => state.favourites);
  const navigate = useNavigate();

  return (
    <div
      className="preview"
      onClick={() => {
        navigate("/movie/" + movie.id);
      }}
    >
      <img
        className="moviePoster"
        src={
          movie.poster_path !== null
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "/nosource.jpg"
        }
        alt="Media unavalabile"
      />
      <div className="titleAndStar">
        <h2 className="movieTitle">{movie.title}</h2>
        {favouritesState.favouritesStatus === "succeeded" ? (
          movie.locations.indexOf("favourites") !== -1 ? (
            <IoIosStar
              color="yellow"
              className="reactIcons"
              onClick={(e) => {
                changeFavouriteState(movie, e, dispatch);
              }}
            />
          ) : (
            <IoIosStarOutline
              className="reactIcons"
              onClick={(e) => {
                changeFavouriteState(movie, e, dispatch);
              }}
            />
          )
        ) : (
          <span></span>
        )}
      </div>
      <div className="dateAndAvg">
        <p>
          Release date
          <br /> {movie.release_date}
        </p>
        <h2 className="movieAvg">{parseInt(movie.vote_average * 10) + "%"}</h2>
      </div>
    </div>
  );
};

export default PreviewComponent;
