import { changeFavouriteThunk } from "../slices/favouritesSlice.js";
import { changeFavouritesLocation } from "../slices/loadedSlice.js";

function changeFavouriteState(movie, event, dispatch) {
  event.stopPropagation();
  dispatch(
    changeFavouriteThunk({
      movieId: movie.id,
      favouriteState: movie.locations.indexOf("favourites") !== -1,
    }),
  ).then(() => dispatch(changeFavouritesLocation(movie.id)));
}

export default changeFavouriteState;
