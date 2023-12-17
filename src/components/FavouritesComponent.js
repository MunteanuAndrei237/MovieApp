import { useSelector } from "react-redux";
import Grid from "./GridComponent.js";

const FavouriesComponent = () => {
  const favoritesState = useSelector((state) => state.favourites);

  return favoritesState.favouritesStatus === "succeeded" ? (
    <Grid location={"favourites"} />
  ) : favoritesState.favouritesStatus === "loading" ? (
    <h1 className="loading">
      Loading favourite movies <div className="loading-spinner" />
    </h1>
  ) : favoritesState.favouritesStatus === "failed" ? (
    <div className="error">
      <h1>We encountered an error</h1>
      <p>{favoritesState.favouritesError}</p>
    </div>
  ) : null;
};

export default FavouriesComponent;
