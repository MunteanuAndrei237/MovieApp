import { useSelector ,useDispatch } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { useParams } from "react-router-dom";
import { getMoviesByGenreThunk } from "./slices/genresSlice.js";
import { useEffect } from "react";
import { addLoadedMovie } from "./slices/loadedMoviesSlice.js";

const SearchGenreResultComponent =()=> {
    const dispatch = useDispatch();
    const genreId=useParams().genreId;

    const genresSliceState = useSelector(state => state.genre);
    const loadedMoviesState = useSelector(state => state.loadedMovies);

    useEffect(() => {
        dispatch(getMoviesByGenreThunk(genreId))

    }, [dispatch,genreId])
   
    useEffect(() => {
        if(genresSliceState.moviesStatus === "succeeded")
          {
            dispatch(addLoadedMovie({movies:genresSliceState.movies,location:genreId}));
          }
      }, [dispatch,genresSliceState.moviesStatus]);

    return(
        genresSliceState.moviesSatus === 'loading' ? <p>loading...</p> :
        genresSliceState.moviesSatus === 'error' ?     
        <div>
            <h1>We ecnountered an error</h1>
            <p>{genresSliceState.moviesError} </p>
            </div>



       : loadedMoviesState.loadedMovies.map((movie) => {
            if(movie.locations.indexOf(genreId) !== -1)
            {
                return <MoviePreviewComponent movie={movie} key={movie.id}/>
            }  
        })
    )
};

export default SearchGenreResultComponent;

