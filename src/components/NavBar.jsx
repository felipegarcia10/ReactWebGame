import { Link } from "react-router-dom";

export default function NavigationBar() {
    return (
        <div>
            <nav>
                <Link to="/" className="btn-signout">Game</Link>
                <Link to="/admin" className="btn-signout">Admin</Link>
            </nav>
        </div>
    )

}