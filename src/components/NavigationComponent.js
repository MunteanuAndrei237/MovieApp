//navigation bar component , contains links to home, favourites and genre select
import SelectCategoryComponent from "./GenreSelectComponent.js";
import { useNavigate } from "react-router-dom";
import "../css/navigation.css";

const NavigationComponent = () => {
  const navigate = useNavigate();

  return (
    <div id="navBar">
      <div className="navItem" onClick={() => navigate("/home")}>
        Home
      </div>
      <div className="navItem" onClick={() => navigate("/favourites")}>
        Favourites
      </div>
      <SelectCategoryComponent />
    </div>
  );
};

export default NavigationComponent;
