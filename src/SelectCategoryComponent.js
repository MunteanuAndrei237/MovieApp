import { useDispatch , useSelector } from "react-redux";
import { selectGenre } from "./slices/genres.js";
import { getGenresThunk } from "./slices/genres.js";
import { useEffect } from "react";
const SelectGenreComponent = () =>
{
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
    genreState.genresStatus === 'succeeded' ? <select id="genre" value={genreState.selectedgenre} onChange={e => dispatch(selectGenre(e.target.value))}>
    <option value="default" disabled>Select a genre</option>
    {genreState.genres.map((genre) => {
        return (
      <option key={genre} value={genre}>
        {genre}
      </option>
    )})}
  </select> : null
      
      
    )
    
}

export default SelectGenreComponent;