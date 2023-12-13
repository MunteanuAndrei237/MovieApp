import { useSelector ,useDispatch } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { useParams } from "react-router-dom";
import { getMoviesByGenreThunk } from "../slices/genresSlice.js";
import { useEffect ,useRef } from "react";
import { addLoadedMovie } from "../slices/loadedSlice.js";
import { isUserNearBottom , loadMoreTimeout } from "../assets/scrolling.js";

const SearchGenreResultComponent =()=> {
    const dispatch = useDispatch();
    const genreId=useParams().genreId;
    const genresSliceState = useSelector(state => state.genre);
    const loadedMoviesState = useSelector(state => state.loadedMovies);


    const canRequestMoreRef = useRef(true);

    function requestMore() {
      if (genresSliceState.moviesStatus === "succeeded" && canRequestMoreRef.current) {
       
        dispatch(getMoviesByGenreThunk(genreId));
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
        dispatch(getMoviesByGenreThunk(genreId))

    }, [dispatch,genreId,genresSliceState.genresStatus])
   
    useEffect(() => {
        if(genresSliceState.moviesStatus === "succeeded")
          {
            dispatch(addLoadedMovie({movies:genresSliceState.movies,location:genreId}));
          }
      }, [dispatch,genresSliceState.moviesStatus]);

    return(
        <div>
        {loadedMoviesState.loadedMovies.map((movie) => {
            if(movie.locations.indexOf(genreId) !== -1)
            {
                return <MoviePreviewComponent movie={movie} key={movie.id}/>
            }  
        })}
        {genresSliceState.moviesSatus === 'loading' ? <p>loading...</p> :
        genresSliceState.moviesSatus === 'failed' ?     
            <div>
            <h1>We ecnountered an error</h1>
            <p>{genresSliceState.moviesError} </p>
            </div> : null}
        </div>
    )
};

export default SearchGenreResultComponent;

