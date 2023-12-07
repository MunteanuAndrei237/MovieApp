import { useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { changeSearchTerm } from "./slices/searchSlice.js";
import { getMoviesByTermThunk } from "./slices/searchSlice.js";
import { useNavigate  } from 'react-router-dom';
const waitingTime = 1000;

const SearchBarComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchSliceState = useSelector(state => state.search);

    useEffect(() => {
      const debounceTimer = setTimeout(() => {
        if(searchSliceState.searchTerm !== "")
        {
          console.log("stating searching");
          navigate('/search');
          dispatch(getMoviesByTermThunk(searchSliceState.searchTerm));
        }
        else
        {
          navigate('/home');
        }
      }, waitingTime); 
  
      return () => clearTimeout(debounceTimer); 
    }, [searchSliceState.searchTerm]);

        return (
            <div>
                <input type="text" value={searchSliceState.searchTerm} onChange={e => dispatch(changeSearchTerm(e.target.value))}/>
                <button>Search</button>
            </div>
        )
}

export default SearchBarComponent;