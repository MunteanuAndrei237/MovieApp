import { useEffect } from "react";

import { useDispatch , useSelector} from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
const FavouriesComponent = () => {   

    const loadedMovies = useSelector(state => state.loadedMovies);
    const favoritesState = useSelector(state => state.favourites);
    return (   
        favoritesState.favouritesStatus === 'succeeded' ?
        loadedMovies.loadedMovies.map((movie) => {
            if(movie.locations.indexOf("favourites") !== -1)  
                    return <div key={movie.id}>
                    <MoviePreviewComponent movie={movie}/>
                    </div>
            })
        : loadedMovies.favouritesStatus === 'loading' ? <p>loading...</p> : loadedMovies.favouritesError
    );
}

export default FavouriesComponent;