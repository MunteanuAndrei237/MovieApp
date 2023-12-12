import { useSelector , useDispatch } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { getMoviesByTermThunk } from "./slices/searchSlice.js";
import { addLoadedMovie } from "./slices/loadedMoviesSlice.js";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const SearchResultComponent = () => {
    const term = useParams().term;
    const dispatch = useDispatch();
    const searchSliceState = useSelector(state => state.search);
    const loadedMoviesState = useSelector(state => state.loadedMovies);

    useEffect(() => {
        dispatch(getMoviesByTermThunk(term));
    }, [dispatch,term])

    useEffect(() => {
        if(searchSliceState.searchStatus === "succeeded")
         { dispatch(addLoadedMovie({movies:searchSliceState.searchMovies,location:term,useTerm:true}));
            }
      }, [dispatch,searchSliceState.searchStatus]);
        
    
        return (
            searchSliceState.searchStatus === 'loading' ? <p>loading...</p> :
            searchSliceState.searchStatus === 'error' ? <div><h1>We ecnountered an error</h1><p>{searchSliceState.error} </p></div> :
            loadedMoviesState.loadedMovies.map((movie) => {
                    if(movie.locations.indexOf("term="+term) !== -1)
                return <MoviePreviewComponent movie={movie} key={movie.id}/>  
            })
        )
    }


export default SearchResultComponent;