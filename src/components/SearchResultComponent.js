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
    const searchSliceState = useSelector(state => state.search);
    const canRequestMoreRef = useRef(true);

    function requestMore() {
      if (canRequestMoreRef.current && searchSliceState.searchStatus !== "failed") {
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
      if(searchSliceState.searchPage[term] === undefined)
        dispatch(fetchMoviesByTermThunk(term));
    }, [dispatch,term])

    useEffect(() => {
        if(searchSliceState.searchStatus === "succeeded")
         {
           dispatch(addLoadedMovie({movies:searchSliceState.searchMovies,location:term,useTerm:true}));
           dispatch(resetSearchToIdle());
         }
      }, [searchSliceState.searchStatus]);
        
    
        return (
          <div>        
            <Grid location={"term="+term}/>
            {searchSliceState.searchStatus === 'loading' ? <p>loading...</p> :
            searchSliceState.searchStatus === 'failed' ? <div><h1>We ecnountered an error</h1><p>{searchSliceState.error} </p></div> : null}
            
            
            </div>
        )
    }


export default SearchResultComponent;