import { useDispatch , useSelector } from "react-redux";
import { fetchGenresThunk } from "../slices/genresSlice.js";
import { useEffect } from "react";
import { useNavigate ,useLocation } from "react-router-dom";

const SelectGenreComponent = () =>
{
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const genreId = isNaN(Number(location.pathname.split('/')[2])) ? "default" : Number(location.pathname.split('/')[2]);

  const genresState = useSelector(state => state.genres);
  useEffect(() => {
        dispatch(fetchGenresThunk());
    }, [dispatch]);

  return (
    genresState.genresStatus === 'loading' ? <select className="navItem">
        <option selected="selected" value="default" disabled>Loading genres...</option>
    </select> :
    
    genresState.genresStatus === 'failed' ? <select className="navItem">
    <option selected="selected" value="default" disabled>Error fetching genres</option>
</select>  :

    genresState.genresStatus === 'succeeded' ? <select className="navItem"
       onClick={e => {
        if(e.detail === 0)
          navigate('/genres/' + e.target.value);
        }}
      >
    <option selected={genreId === "default" ? "selected" : null}  value="default" disabled>Select genre</option>
    {genresState.genres.map((genre) => { 
        return (
      <option selected={genreId === genre.id ? "selected" : null }  key={genre.name} value={genre.id}>
        {genre.name}
      </option>
    )})}
  </select> : null
    )
}

export default SelectGenreComponent;