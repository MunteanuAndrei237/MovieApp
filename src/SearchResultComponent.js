import { useSelector } from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
const SearchResultComponent = () => {
    
        const searchSliceState = useSelector(state => state.search);
    
        return (
            searchSliceState.status === 'loading' ? <p>loading...</p> :
            searchSliceState.status === 'error' ? <div><h1>We ecnountered an error</h1><p>{searchSliceState.error} </p></div> :
            searchSliceState.movies.map((movie) => {
                return <MoviePreviewComponent movie={movie} key={movie.id}/>  
            })
        )
    }


export default SearchResultComponent;