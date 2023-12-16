import { useSelector ,useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMoviesByGenreThunk } from "../slices/genresSlice.js";
import { useEffect ,useRef } from "react";
import { addLoadedMovie } from "../slices/loadedSlice.js";
import { isUserNearBottom , loadMoreTimeout } from "../assets/scrolling.js";
import { resetGenreToIdle } from "../slices/genresSlice.js";
import Grid from "./GridComponent.js";

const SearchGenreResultComponent =()=> {
    const dispatch = useDispatch();
    const genreId=useParams().genreId;
    const genresSliceState = useSelector(state => state.genres);
    const canRequestMoreRef = useRef(true);

    function requestMore() {
      if (genresSliceState.moviesStatus !== "failed" && canRequestMoreRef.current
      && genresSliceState.genresPage[genreId] <= genresSliceState.genresTotalPages[genreId]) {
        dispatch(fetchMoviesByGenreThunk(genreId));
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
    }, [requestMore,genreId]);

    useEffect(() => {
        if(genresSliceState.genresStatus === 'succeeded' && genresSliceState.genresPage[genreId] === 1 )
        {
          dispatch(fetchMoviesByGenreThunk(genreId));
        }

    }, [dispatch,genreId,genresSliceState.genresStatus])
   
    useEffect(() => {
        if(genresSliceState.moviesStatus === "succeeded")
          {
            dispatch(addLoadedMovie({movies:genresSliceState.movies,location:genreId}));
            dispatch(resetGenreToIdle());
          }
      }, [dispatch,genresSliceState.moviesStatus]);

    return(
        <div>
        <Grid location={genreId}/>
        {genresSliceState.moviesStatus === 'loading' ? <p>loading...</p> :
        genresSliceState.moviesStatus === 'failed' ?     
            <div>
            <h1>We ecnountered an error</h1>
            <p>{genresSliceState.moviesError} </p>
            </div> : null}
        </div>
    )
};

export default SearchGenreResultComponent;

