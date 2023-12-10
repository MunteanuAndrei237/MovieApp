import './App.css';
import HomeComponent from './homeComponent.js';
import {generateTokenThunk , tryValidateTokenThunk } from './slices/userSlice.js';
import { fetchHomeMoviesThunk } from './slices/loadedMoviesSlice.js';
import { useEffect  } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { Routes, Route , useParams } from "react-router-dom";
import FavouriesComponent from './FavouritesComponent.js';
import NavigationComponent from './NavigationComponent.js';
import { getFavouriteMoviesThunk } from './slices/loadedMoviesSlice.js';
import SearchBarComponent from './SearchBarComponent.js';
import SearchResultComponent from './SearchResultComponent.js';
import SearchGenreResultComponent from './SearchGenreResultComponent.js';
import MovieDetailsComponent from './MovieDetailsComponent.js';
const checkForTokenActivationInterval=3500;

function App() {
  const dispatch = useDispatch();
  const loadedMoviesState = useSelector(state => state.loadedMovies);
  const userState = useSelector(state => state.user);

  useEffect(() => {
    dispatch(generateTokenThunk());
  }, [])

  useEffect(() => {
    if(userState.user !== null)
    dispatch(getFavouriteMoviesThunk());
}, [userState.user]);

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



  return (
    <div className="App">
{userState.user !== null ? (<div><p>{userState.user.id}</p> <button onClick={()=>console.log(loadedMoviesState.loadedMovies)}>Print</button>
<SearchBarComponent/>
<NavigationComponent/> 
  <Routes>
      <Route path="/"  element={<FavouriesComponent />} />
      <Route path="/genres/:genreId"  element={<SearchGenreResultComponent/>} />
      <Route path="/home"  element={<HomeComponent />} />
      <Route path="/favourites"  element={<FavouriesComponent />} />
      <Route path="/search" element={<SearchResultComponent />}/>
      <Route path="/movie/:movieId" element={<MovieDetailsComponent />}/>
      </Routes></div>) : <h1>Please sign in first</h1>
    }     

    </div>
  );
}

export default App;
