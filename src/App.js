//main component of the app, it is responsible for rendering the header and body components. It also handles the token generation and session creation
import HeaderComponent from "./components/HeaderComponent.js";
import BodyComponent from "./components/BodyComponent.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavouriteMoviesThunk } from "./slices/favouritesSlice.js";
import { addMovieToLocation } from "./slices/loadedSlice.js";
import {
  generateTokenThunk,
  tryCreateSessionThunk,
  fetchUserInformationThunk,
} from "./slices/userSlice.js";
import "./App.css";

const checkForTokenActivationInterval = 2500;

function App() {
  const dispatch = useDispatch();
  const favouritesState = useSelector((state) => state.favourites);
  const userState = useSelector((state) => state.user);

  //generate token
  useEffect(() => {
    dispatch(generateTokenThunk());
  }, [dispatch]);

  //after token is generated, check if it was activated and create session
  useEffect(() => {
    if (userState.tokenState === "succeeded") {
      const validateTokenInterval = setInterval(async () => {
        const response = await dispatch(tryCreateSessionThunk(userState.token));
        if (response.payload !== undefined)
          clearInterval(validateTokenInterval);
      }, checkForTokenActivationInterval);
    }
  }, [dispatch, userState.tokenState, userState.token]);

  //after session is created, fetch user information
  useEffect(() => {
    if (userState.sessionState === "succeeded")
      dispatch(fetchUserInformationThunk());
  }, [dispatch, userState.sessionState]);

  //after user information is fetched, fetch ALL favourite movies
  useEffect(() => {
    if (
      userState.user !== null &&
      (favouritesState.favouritesStatus === "idle" ||
        favouritesState.favouritesStatus === "fetchMore")
    )
      dispatch(fetchFavouriteMoviesThunk());
  }, [dispatch, userState.user, favouritesState.favouritesStatus]);

  //after favourite movies are fetched, add them to loaded movies
  useEffect(() => {
    if (favouritesState.favouritesStatus === "succeeded")
      dispatch(
        addMovieToLocation({
          movies: favouritesState.favouritesMovies,
          location: "favourites",
        }),
      );
  }, [
    dispatch,
    favouritesState.favouritesStatus,
    favouritesState.favouritesMovies,
  ]);

  //render the head component , check for errors in token generation, session creation and user information fetching , then render the body component if everything is ok
  return (
    <div className="App">
      <HeaderComponent />

      {userState.tokenState === "loading" ? (
        <h1 className="loading">
          Generating token
          <div className="loading-spinner" />
        </h1>
      ) : userState.tokenState === "failed" ? (
        <div className="error">
          <h1>
            We encountered an error generating the token. Check connection and
            try again.
          </h1>
          <p>{userState.tokenError}</p>
        </div>
      ) : userState.sessionState === "loading" ? (
        <h1 className="loading">
          {" "}
          Trying to validate session
          <div className="loading-spinner" />
        </h1>
      ) : userState.sessionState === "failed" ? (
        <div className="error">
          <h1>
            Please validate the token first. If no tabs were opened , validate
            the token on the following link: <br></br>{" "}
            <a
              href={
                "https://www.themoviedb.org/authenticate/" + userState.token
              }
            >
              {"https://www.themoviedb.org/authenticate/" + userState.token}
            </a>
          </h1>
          <p>{userState.sessionError}</p>
        </div>
      ) : userState.userState === "loading" ? (
        <h1 className="loading">
          Loading user details...
          <div className="loading-spinner" />
        </h1>
      ) : userState.userState === "failed" ? (
        <div className="error">
          <h1>
            We encountered an error loading your details. Make sure your
            acccount is verified and you replaced the access token and try again{" "}
          </h1>
          <p>{userState.userError}</p>
        </div>
      ) : userState.userState === "succeeded" ? (
        <BodyComponent />
      ) : null}
    </div>
  );
}

export default App;

//add this for debugging   const loadedState = useSelector(state => state.loaded);   <button onClick={() => console.log(loadedState)}>print</button>
