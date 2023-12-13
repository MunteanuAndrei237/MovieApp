import { useSelector , useDispatch } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { getMoviesByTermThunk } from "../slices/searchSlice.js";
import { addLoadedMovie } from "../slices/loadedSlice.js";
import { useParams } from "react-router-dom";
import { useEffect , useRef } from "react";
import { isUserNearBottom , loadMoreTimeout } from "../assets/scrolling.js";

const SearchResultComponent = () => {
    const term = useParams().term;
    const dispatch = useDispatch();
    const searchSliceState = useSelector(state => state.search);
    const loadedMoviesState = useSelector(state => state.loadedMovies);

    const canRequestMoreRef = useRef(true);

    function requestMore() {
      if (searchSliceState.searchStatus === "succeeded" && canRequestMoreRef.current) {
       
        dispatch(getMoviesByTermThunk(term));
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
        dispatch(getMoviesByTermThunk(term));
    }, [dispatch,term])

    useEffect(() => {
        if(searchSliceState.searchStatus === "succeeded")
         { dispatch(addLoadedMovie({movies:searchSliceState.searchMovies,location:term,useTerm:true}));
            }
      }, [dispatch,searchSliceState.searchStatus]);
        
    
        return (
          <div>{loadedMoviesState.loadedMovies.map((movie) => {
            if(movie.locations.indexOf("term="+term) !== -1)
        return <MoviePreviewComponent movie={movie} key={movie.id}/>  
      })}
            {searchSliceState.searchStatus === 'loading' ? <p>loading...</p> :
            searchSliceState.searchStatus === 'failed' ? <div><h1>We ecnountered an error</h1><p>{searchSliceState.error} </p></div> : null}
            
            
            </div>
        )
    }


export default SearchResultComponent;