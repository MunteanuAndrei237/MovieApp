import './App.css';
import HomeComponent from './components/HomeComponent.js';
import { generateTokenThunk , tryCreateSessionThunk , fetchUserInformationThunk} from './slices/userSlice.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from "react-router-dom";
import FavouriesComponent from './components/FavouritesComponent.js';
import NavigationComponent from './components/NavigationComponent.js';
import { fetchFavouriteMoviesThunk } from './slices/favouritesSlice.js';
import SearchBarComponent from './components/SearchBarComponent.js';
import SearchResultComponent from './components/SearchResultComponent.js';
import SearchGenreResultComponent from './components/GenreResultComponent.js';
import MovieComponent from './components/MovieComponent.js';
import { addLoadedMovie } from './slices/loadedSlice.js';
import HeaderComponent from './components/HeaderComponent.js';

const checkForTokenActivationInterval = 2500;

function App() {
  const dispatch = useDispatch();
  const favouritesState = useSelector(state => state.favourites);
  const userState = useSelector(state => state.user);
  useEffect(() => {
    dispatch(generateTokenThunk());
  }, [])

  useEffect(() => {
    if (userState.tokenState === "succeeded")
    {
      const validateTokenInterval = setInterval(async () => {
        let response = await dispatch(tryCreateSessionThunk(userState.token));
        if (response.payload !== undefined) {
          clearInterval(validateTokenInterval);
        }
      }, checkForTokenActivationInterval);
    }
  }, [userState.tokenState])

  useEffect(() => {
    if (userState.sessionState === "succeeded") {
      dispatch(fetchUserInformationThunk());
    }
  }, [userState.sessionState])

  useEffect(() => {
    if (userState.user !== null && favouritesState.favouritesStatus === "idle" || favouritesState.favouritesStatus === "fetchMore")
      dispatch(fetchFavouriteMoviesThunk());
  }, [userState.user, favouritesState.favouritesStatus]);

  useEffect(() => {
    if (favouritesState.favouritesStatus === "succeeded") {
      dispatch(addLoadedMovie({ movies: favouritesState.favouritesMovies, location: "favourites" }));
    }
  }, [dispatch, favouritesState.favouritesStatus]);

  return (
    <div className="App">
      
      <HeaderComponent />
      {userState.tokenState === "loading" ? <h1 className='loading'>Generating token<div className="loading-spinner"/></h1> :
        userState.tokenState === "failed" ? <div className="error"><h1>We encountered an error generating the token. Check connection and try again.</h1><p>{userState.tokenError}</p></div> :
      userState.sessionState === "loading" ? <h1 className='loading'> Trying to validate session<div className="loading-spinner"/></h1> :
        userState.sessionState === "failed" ? <div className="error"><h1>Please validate the token first. If no tabs were opened , validate the token on the following link: 
         <br></br> <a href={"https://www.themoviedb.org/authenticate/"+ userState.token}>{"https://www.themoviedb.org/authenticate/" + userState.token }</a></h1><p>{userState.sessionError}</p></div> :
      userState.userState === "loading"  ? <h1 className='loading'>Loading user details...<div className="loading-spinner"/></h1>
        : userState.userState === "failed" ? <div className="error"><h1>We encountered an error loading your details. Make sure your acccount is verified and you replaced the access token and try again </h1><p>{userState.userError}</p></div> :
        userState.userState === "succeeded" ?
      <div>
        
        <SearchBarComponent />
        <NavigationComponent />
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/genres/:genreId" element={<SearchGenreResultComponent />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/favourites" element={<FavouriesComponent />} />
          <Route path="/search/:term" element={<SearchResultComponent />} />
          <Route path="/movie/:movieId" element={<MovieComponent />} />
        </Routes>
        </div> : null
      }
    </div>
  );
}

export default App;


//add this for debugging       cosnt loadedState = useSelector(state => state.loaded); <button onClick={() => console.log(loadedState)}>print</button>

