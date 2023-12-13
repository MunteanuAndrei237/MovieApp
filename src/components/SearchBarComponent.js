import { useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { changeSearchTerm } from "../slices/searchSlice.js";
import { useNavigate  } from 'react-router-dom';
const waitingTime = 1000;

const SearchBarComponent = () => {
    const navigate = useNavigate();
    const searchSliceState = useSelector(state => state.search);
    const dispatch = useDispatch();
    useEffect(() => {
      const debounceTimer = setTimeout(() => {
        if(searchSliceState.searchTerm !== "")
        {
          navigate('/search/'+searchSliceState.searchTerm);
        }
      }, waitingTime); 
  
      return () => clearTimeout(debounceTimer); 

    }, [searchSliceState.searchTerm]);

        return (
            <div>
                <input type="text" value={searchSliceState.searchTerm} onChange={e=>dispatch(changeSearchTerm(e.target.value))}/>
                <button onClick={()=>navigate('/search/'+searchSliceState.searchTerm)}>Search</button><button onClick={()=>dispatch(changeSearchTerm(""))}>Clear</button>
            </div>
        )
}

export default SearchBarComponent;