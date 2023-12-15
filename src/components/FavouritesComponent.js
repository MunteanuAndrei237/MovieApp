import { useSelector} from "react-redux";
import Grid from "./GridComponent.js";

const FavouriesComponent = () => {   
    const favoritesState = useSelector(state => state.favourites);
    
    return (   
        favoritesState.favouritesStatus === 'succeeded' ?
        <Grid location={"favourites"}/>
        : favoritesState.favouritesStatus === 'loading' ? <p>loading...</p> : 
        favoritesState.favouritesStatus === 'failed' ? <div><h3>we encountered an error</h3><p>{favoritesState.favouritesError}</p></div> : null
    );
}

export default FavouriesComponent;