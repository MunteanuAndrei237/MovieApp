import { Link } from "react-router-dom";
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
        </div>
    );
}

export default NavigationComponent;