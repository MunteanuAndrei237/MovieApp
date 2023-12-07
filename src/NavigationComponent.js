import { Link } from "react-router-dom";
import SelectCategoryComponent from "./SelectCategoryComponent";
const NavigationComponent = () => {
    return (
        <div>
        <ul>
            <li>
            <Link to="/home">Home</Link>
            </li>
            <li>
            <Link to="/favourites">Favourites</Link>
            </li>
            
        </ul>
        <SelectCategoryComponent/>
        </div>
    );
}

export default NavigationComponent;