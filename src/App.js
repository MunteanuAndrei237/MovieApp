import './App.css';
import HomeComponent from './components/HomeComponent.js';
import {generateTokenThunk , tryValidateTokenThunk } from './slices/userSlice.js';
import { useEffect  } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { Routes, Route ,useLocation } from "react-router-dom";
import FavouriesComponent from './components/FavouritesComponent.js';
import NavigationComponent from './components/NavigationComponent.js';
import { getFavouriteMoviesThunk } from './slices/favouritesSlice.js';
import SearchBarComponent from './components/SearchBarComponent.js';
import SearchResultComponent from './components/SearchResultComponent.js';
import SearchGenreResultComponent from './components/GenreResultComponent.js';
import MovieDetailsComponent from './components/MovieDetailsComponent.js';
import { addLoadedMovie } from './slices/loadedSlice.js';
const checkForTokenActivationInterval=3500;


function App() {
  const dispatch = useDispatch();
  const favouritesState = useSelector(state => state.favourites);
  const userState = useSelector(state => state.user);
  const loadedState=useSelector(state => state.loadedMovies);
  const location = useLocation();
  useEffect(() => {  
      window.removeEventListener('scroll', () => {});
  },[location.pathname]);

  useEffect(() => {
    dispatch(generateTokenThunk());
  }, [])

  useEffect(() => {
    if(userState.sessionToken !== null)// it is null only one and once session started it cannot be modified
    {
        const validateTokenInterval=setInterval( async ()=>{
        let validatePromise=await dispatch(tryValidateTokenThunk(userState.sessionToken));
        if(validatePromise.type==="user/tryValidateTokenThunk/fulfilled")
        {
          clearInterval(validateTokenInterval);
        }
      },checkForTokenActivationInterval);
    }
  },[userState.sessionToken])

  useEffect(() => {
    if(userState.user !== null && favouritesState.favouritesStatus === "idle" || favouritesState.favouritesStatus === "fetchMore")
    dispatch(getFavouriteMoviesThunk());
}, [userState.user,favouritesState.favouritesStatus]);

useEffect(() => {
  if(favouritesState.favouritesStatus === "succeeded")
    {
      dispatch(addLoadedMovie({movies:favouritesState.favouritesMovies,location:"favourites"}));
    }
}, [dispatch,favouritesState.favouritesStatus]);

  return (
    <div className="App">
{userState.user !== null ? (<div><p>{userState.user.id}</p> 
<button onClick={()=>console.log(loadedState)}>print</button>
<SearchBarComponent/>
<NavigationComponent/> 
  <Routes>
      <Route path="/"  element={<HomeComponent />} />
      <Route path="/genres/:genreId"  element={<SearchGenreResultComponent/>} />
      <Route path="/home"  element={<HomeComponent />} />
      <Route path="/favourites"  element={<FavouriesComponent />} />
      <Route path="/search/:term" element={<SearchResultComponent />}/>
      <Route path="/movie/:movieId" element={<MovieDetailsComponent />}/>
      </Routes></div>) : <h1>Please sign in first</h1>
    }     

    </div>
  );
}

export default App;
