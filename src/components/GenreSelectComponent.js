// component fetching the genres and displaying them in a select element
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGenresThunk } from "../slices/genresSlice.js";

const SelectGenreComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const genresState = useSelector((state) => state.genres);

  //fetch genres
  useEffect(() => {
    dispatch(fetchGenresThunk());
  }, [dispatch]);

  return genresState.genresStatus === "loading" ? (
    <select className="navItem" defaultValue="default">
      <option value="default" disabled>
        Loading genres...
      </option>
    </select>
  ) : genresState.genresStatus === "failed" ? (
    <select className="navItem" defaultValue="default">
      <option value="default" disabled>
        Error fetching genres
      </option>
    </select>
  ) : genresState.genresStatus === "succeeded" ? (
    <select
      className="navItem"
      value={genresState.selectedGenre}
      onChange={(e) => {
        navigate("/genres/" + e.target.value);
      }}
    >
      <option value="default" disabled>
        Select genre
      </option>
      {genresState.genres.map((genre) => {
        return (
          <option key={genre.name} value={genre.id}>
            {genre.name}
          </option>
        );
      })}
    </select>
  ) : null;
};

export default SelectGenreComponent;
