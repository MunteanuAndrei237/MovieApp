import { useEffect } from "react";
import { fetchHomeMoviesThunk , fetchMoovieDetailsByIdThunk } from './slices/homeSlice.js';
import { useSelector, useDispatch } from "react-redux";
const HomeComponent = () => {

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
        return <p key={movie.id}>
          {movie.detailsFetched === true ? <p>{movie.title}</p> : <p>loading...</p>}
          {movie.id}</p>
      }

      )
  )

}

export default HomeComponent;