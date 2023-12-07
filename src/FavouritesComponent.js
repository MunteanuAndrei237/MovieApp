import { useEffect } from "react";
import { getFavouriteMoviesThunk } from './slices/favouriteSlice.js';
import { useDispatch , useSelector} from "react-redux";
const FavouriesComponent = () => {   

    const dispatch = useDispatch();
    const favouriteMoviesState = useSelector(state => state.favourite);

    useEffect(() => {
        dispatch(getFavouriteMoviesThunk());
    }, [dispatch]);

    useEffect(() => {
        if(favouriteMoviesState.status === 'succeeded')
        {
            <p>succeeded</p>
        }
    }, [favouriteMoviesState.status]);

    return (   
        <h1>Favourites</h1>
    );
}

export default FavouriesComponent;