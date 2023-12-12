import './App.css';
import HomeComponent from './homeComponent.js';
import {generateTokenThunk , tryValidateTokenThunk } from './slices/userSlice.js';
import { useEffect  } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { Routes, Route  } from "react-router-dom";
import FavouriesComponent from './FavouritesComponent.js';
import NavigationComponent from './NavigationComponent.js';
import { getFavouriteMoviesThunk } from './slices/favouritesSlice.js';
import SearchBarComponent from './SearchBarComponent.js';
import SearchResultComponent from './SearchResultComponent.js';
import SearchGenreResultComponent from './genreResultComponent.js';
import MovieDetailsComponent from './MovieDetailsComponent.js';
import { addLoadedMovie } from './slices/loadedMoviesSlice.js';
const checkForTokenActivationInterval=3500;

function isUserNearBottom() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.scrollY ||  document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
  const threshold = 0.98;
  return scrollPosition > threshold * (documentHeight - windowHeight);
}
// window.addEventListener('scroll', () => {
//   if (isUserNearBottom()) {
//     if (canRequestMore) {
//       requestMore();
//       canRequestMore = false;
//       setTimeout(() => {
//         canRequestMore = true;
//       }, 1000); // Set the timeout duration (1 second in this example)
//     }
//   }
// });

function App() {
  const dispatch = useDispatch();
  const favouritesState = useSelector(state => state.favourites);
  const userState = useSelector(state => state.user);
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
    if(userState.user !== null)
    dispatch(getFavouriteMoviesThunk());
}, [userState.user]);

useEffect(() => {
  if(favouritesState.favouritesStatus === "succeeded")
    {
      
      dispatch(addLoadedMovie({movies:favouritesState.favouritesMovies,location:"favourites"}));
    }
}, [dispatch,favouritesState.favouritesStatus]);

  return (
    <div className="App">
{userState.user !== null ? (<div><p>{userState.user.id}</p> 
<SearchBarComponent/>
<NavigationComponent/> 
  <Routes>
      <Route path="/"  element={<FavouriesComponent />} />
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
