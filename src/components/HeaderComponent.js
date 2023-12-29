//component for the header of the app, contains the title and the user info
import { useSelector } from "react-redux";
import "../css/header.css";

const HeaderComponent = () => {
  const userState = useSelector((state) => state.user);

  return (
    <div id="header">
      <span></span>
      <span></span>
      <h1 id="title">Movie app</h1>
      <span></span>
      <div id="user">
        {userState.user != null ? (
          <div>
            <p>Hello, </p> <p>{userState.user.username}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderComponent;
