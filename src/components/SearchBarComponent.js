//component renderinf the search bar
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { changeSearchTerm } from "../slices/searchSlice.js";
import "../css/searchBar.css";

const waitingTime = 1000;

const SearchBarComponent = () => {
  const navigate = useNavigate();
  const searchSliceState = useSelector((state) => state.search);
  const dispatch = useDispatch();

  //debounce search bar
  //when user stops typing for {waitingTime} ms, navigate to search page
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchSliceState.searchTerm !== "")
        navigate("/search/" + searchSliceState.searchTerm);
    }, waitingTime);
    return () => clearTimeout(debounceTimer);
  }, [searchSliceState.searchTerm]);

  return (
    <div id="searchBarConatiner">
      <div id="searchDiv">
        <FaTrashAlt
          className="reactIcons"
          onClick={() => dispatch(changeSearchTerm(""))}
        />
        <input
          id="searchInput"
          placeholder="Enter movie name here"
          type="text"
          value={searchSliceState.searchTerm}
          onChange={(e) => dispatch(changeSearchTerm(e.target.value))}
        />
        <FaSearch
          className="reactIcons"
          onClick={() => navigate("/search/" + searchSliceState.searchTerm)}
        />
      </div>
    </div>
  );
};

export default SearchBarComponent;
