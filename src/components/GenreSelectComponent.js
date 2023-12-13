import { useDispatch , useSelector } from "react-redux";
import { getGenresThunk } from "../slices/genresSlice.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SelectGenreComponent = () =>
{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genreState = useSelector(state => state.genre);
    useEffect(() => {
          dispatch(getGenresThunk());
      }, [dispatch]);
    return (
    genreState.genresStatus === 'loading' ? <select>
        <option value="default" disabled>Loading genres...</option>
    </select> :
    
    genreState.genresStatus === 'failed' ? <select>
    <option value="default" disabled>Error fetching genres</option>
</select>  :
    genreState.genresStatus === 'succeeded' ? <select id="genre" value={genreState.selectedGenre} onChange={e => {      
      navigate('/genres/' + e.target.value);
      }}>
    <option value="default" disabled>Select a genre</option>
    {genreState.genres.map((genre) => {
        return (
      <option key={genre.name} value={genre.id}>
        {genre.name}
      </option>
    )})}
  </select> : null
      
      
    )
    
}

export default SelectGenreComponent;