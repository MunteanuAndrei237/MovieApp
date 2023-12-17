import { useSelector , useDispatch } from "react-redux";
import { fetchMoviesByTermThunk } from "../slices/searchSlice.js";
import { addLoadedMovie } from "../slices/loadedSlice.js";
import { useParams } from "react-router-dom";
import { useEffect , useRef } from "react";
import { isUserNearBottom , loadMoreTimeout } from "../assets/scrolling.js";
import { resetSearchToIdle  } from "../slices/searchSlice.js";
import Grid from "./GridComponent.js";

const SearchResultComponent = () => {
    const term = useParams().term;
    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);
    const canRequestMoreRef = useRef(true);

    function requestMore() {
      if (canRequestMoreRef.current && searchState.searchStatus !== "failed" && 
      (searchState.searchTotalPages[term]=== undefined || searchState.searchPage[term] <= searchState.searchTotalPages[term])) 
      {
        dispatch(fetchMoviesByTermThunk(term));
        canRequestMoreRef.current = false;
        setTimeout(() => {
          canRequestMoreRef.current = true;
        }, loadMoreTimeout); 
      }
    }
  
    function handleScroll() {
        
      if (isUserNearBottom()) {
        requestMore();
      }
    }
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return ()=>{window.removeEventListener('scroll', handleScroll);}
    }, [requestMore,term]);


    useEffect(() => {
      if(searchState.searchPage[term] === undefined)
        dispatch(fetchMoviesByTermThunk(term));
    }, [dispatch,term])

    useEffect(() => {
        if(searchState.searchStatus === "succeeded")
         {
           dispatch(addLoadedMovie({movies:searchState.searchMovies,location:term,useTerm:true}));
           dispatch(resetSearchToIdle());
         }
      }, [searchState.searchStatus]);
        
    
        return (
          <div>        
            <Grid location={"term="+term}/>
            {searchState.searchStatus === 'loading' ? <h1 className="loading">Loading movies</h1> :
            searchState.searchStatus === 'failed' ? <div className="error"><h1>We ecnountered an error</h1><p>{searchState.searchError} </p></div> : null}
            
            
            </div>
        )
    }


export default SearchResultComponent;