import { useEffect } from "react";

import { useDispatch , useSelector} from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
const FavouriesComponent = () => {   

    const loadedMovies = useSelector(state => state.loadedMovies);

    return (   
        loadedMovies.favouritesStatus === 'succeeded' ?
        loadedMovies.loadedMovies.map((movie) => {
            
            if(movie.inFavourites === true)
                return <div key={movie.id}>
                    <MoviePreviewComponent movie={movie}/>
                    </div>
            })
        : loadedMovies.favouritesStatus === 'loading' ? <p>loading...</p> : loadedMovies.favouritesError
    );
}

export default FavouriesComponent;