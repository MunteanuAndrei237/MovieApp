import { useDispatch , useSelector } from "react-redux";
import { selectGenre } from "./slices/genresSlice.js";
import { getGenresThunk } from "./slices/genresSlice.js";
import { useEffect } from "react";
import { getMoviesByGenreThunk } from "./slices/genresSlice.js";
import { useNavigate } from "react-router-dom";
const SelectGenreComponent = () =>
{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genreState = useSelector(state => state.genre);
    const loadedMoviesState = useSelector(state => state.loadedMovies);
    useEffect(() => {
        if(loadedMoviesState.favouritesStatus === "succeeded" || loadedMoviesState.favouritesStatus === "rejected")
          dispatch(getGenresThunk());
      }, [dispatch,loadedMoviesState.favouritesStatus]);
    return (
    genreState.genresStatus === 'loading' ? <select>
        <option value="default" disabled>Loading genres...</option>
    </select> :
    
    genreState.genresStatus === 'error' ? <select>
    <option value="default" disabled>Error fetching genres</option>
</select>  :
    genreState.genresStatus === 'succeeded' ? <select id="genre" value={genreState.selectedGenre} onChange={e => {
      dispatch(selectGenre(e.target.value))
      dispatch(getMoviesByGenreThunk(e.target.value))
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