import { useSelector } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
import { useParams } from "react-router-dom";
const SearchGenreResultComponent =()=> {
    const genresSliceState = useSelector(state => state.genre);
    const genreId=useParams().genreId;
    
    return(
        genresSliceState.stats === 'loading' ? <p>loading...</p> :
        genresSliceState.status === 'error' ? <div><h1>We ecnountered an error</h1><p>{genresSliceState.error} </p></div> :
        genresSliceState.movies[genreId].map((movie) => {
            return <MoviePreviewComponent movie={movie} key={movie.id}/>  
        })
    )
};

export default SearchGenreResultComponent;

