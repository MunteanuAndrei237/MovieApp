import './App.css';
import HomeComponent from './homeComponent.js';
import {generateTokenThunk , tryValidateTokenThunk} from './slices/userSlice.js';
import { useEffect, useMemo  } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { Routes, Route } from "react-router-dom";
import FavouriesComponent from './FavouritesComponent.js';
import NavigationComponent from './NavigationComponent.js';
const checkForTokenActivationInterval=5000;

function App() {

  const memoizedHomeComponent = useMemo(() => <HomeComponent />, []);

  const userState = useSelector(state => state.user);

  const dispatch = useDispatch();
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

  return (
    <div className="App">
{userState.user !== null ? (<div><p>{userState.user.id}</p>
<NavigationComponent/> 
  <Routes>
      <Route path="/"  element={<HomeComponent/>} />
      <Route path="/home"  element={memoizedHomeComponent} />
      <Route path="/favourites"  element={<FavouriesComponent/>} />
      </Routes></div>) : <h1>Please sign in first</h1>
    }     

    </div>
  );
}

export default App;
