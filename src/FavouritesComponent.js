import { useEffect } from "react";

import { useDispatch , useSelector} from "react-redux";
import MoviePreviewComponent from "./MoviePreviewComponent.js";
const FavouriesComponent = () => {   

    const dispatch = useDispatch();
    const favouriteMoviesState = useSelector(state => state.favourite);

    // useEffect(() => {
    //     if()
    //     {
    //         <p>succeeded</p>
    //     }
    // }, [favouriteMoviesState.status]);

    return (   
        favouriteMoviesState.status === 'succeeded' ?
        favouriteMoviesState.favouriteMovies.map((movie) => {
                return <div key={movie.id}>
                    <MoviePreviewComponent movie={movie}/>
                    </div>
            })
        : favouriteMoviesState.status === 'loading' ? <p>loading...</p> : favouriteMoviesState.error
    );
}

export default FavouriesComponent;