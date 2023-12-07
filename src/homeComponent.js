import { useEffect } from "react";
import { fetchHomeMoviesThunk , fetchMoovieDetailsByIdThunk } from './slices/homeSlice.js';
import { useSelector, useDispatch } from "react-redux";
import { addMovieToFavouritesThunk } from "./slices/favouriteSlice.js";
import NavigationComponent from "./NavigationComponent.js";
const HomeComponent = () => {

  function changeFavouriteState(id)
  {
    dispatch(addMovieToFavouritesThunk(id))
  }

  const dispatch = useDispatch();
  const homeMoviesState = useSelector(state => state.home);

  useEffect(() => {
    
      dispatch(fetchHomeMoviesThunk());
    
  }, [dispatch]);

  useEffect(() => {
    
    if (homeMoviesState.status === "succeeded") {
      homeMoviesState.homeMovies.forEach(movie => {
        dispatch(fetchMoovieDetailsByIdThunk({ id: movie.id, index: movie.index }));

      });
    }
  }, [dispatch, homeMoviesState.status ]);

  return (
    homeMoviesState.status === 'loading' ? <p>loading...</p> : homeMoviesState.status === 'error' ? <div><h1>We ecnountered an error</h1><p>homeMoviesState.error </p></div> :
      homeMoviesState.homeMovies.map((movie) => {
        return <div key={movie.id}>
          {movie.detailsFetched === true ? <div><p>{movie.title}</p> <img src={"https://image.tmdb.org/t/p/w92"+movie.poster_path}/>
          <p>Release date {movie.release_date}</p><p>Vote average {movie.vote_average}</p><button onClick={()=>{changeFavouriteState(movie.id)}}>Add to favourites</button></div> : <p>loading...</p>}
          {movie.id}</div>
      }

      )
  )

}

export default HomeComponent;