//component containg the entire page except the header. It handles the routing
import SearchBarComponent from "./SearchBarComponent.js";
import SearchResultComponent from "./SearchResultComponent.js";
import SearchGenreResultComponent from "./GenreResultComponent.js";
import MovieComponent from "./MovieComponent.js";
import HomeComponent from "./HomeComponent.js";
import FavouriesComponent from "./FavouritesComponent.js";
import NavigationComponent from "./NavigationComponent.js";
import { Routes, Route } from "react-router-dom";
import { useRef, useEffect } from "react";
import { isUserNearBottom, loadMoreTimeout } from "../assets/scrolling.js";

const BodyComponent = () => {
  //scrolling refs
  const scrollRef = useRef(null);
  const canRequestMoreRef = useRef(true);

  //if user scrolls to bottom, load more movies
  function handleScroll() {
    if (isUserNearBottom() && canRequestMoreRef.current) {
      canRequestMoreRef.current = false;
      setTimeout(() => {
        canRequestMoreRef.current = true;
      }, loadMoreTimeout);
      if (scrollRef.current !== null) scrollRef.current();
    }
  }

  //add and remove event listener for scrolling
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <SearchBarComponent />
      <NavigationComponent />
      <Routes>
        <Route path="/" element={<HomeComponent ref={scrollRef} />} />
        <Route
          path="/genres/:genreId"
          element={<SearchGenreResultComponent ref={scrollRef} />}
        />
        <Route path="/home" element={<HomeComponent ref={scrollRef} />} />
        <Route path="/favourites" element={<FavouriesComponent />} />
        <Route
          path="/search/:term"
          element={<SearchResultComponent ref={scrollRef} />}
        />
        <Route path="/movie/:movieId" element={<MovieComponent />} />
      </Routes>
    </div>
  );
};

export default BodyComponent;
