import { useEffect } from "react";
import {fetchHomeMoviesThunk} from './slices/homeSlice.js';
import { useSelector , useDispatch } from "react-redux";
const HomeComponent =()=> {

    const dispatch= useDispatch();
useEffect(() => {
dispatch(fetchHomeMoviesThunk())
}, []);
    const homeMoviesState= useSelector(state => state.home);
    const homeMovies= useSelector(state => state.home.homeMovies);
    console.log(homeMoviesState.homeMovies)
   return (
    homeMoviesState.status === 'loading' ? <p>loading...</p> : homeMoviesState.status === 'error' ? <div><h1>We ecnountered an error</h1><p>homeMoviesState.error </p></div> : 
    homeMovies.map((movie) => {
        return <p key={movie.id}>{movie.id}</p>
    }
                    
   )
   )
    
}

export default HomeComponent;