import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light py-3">
      <div className="container">

        <Link to="/" className="navbar-brand">
          <h2 className="text-primary m-0">🏥 Medinova</h2>
        </Link>

        <div className="navbar-nav ms-auto">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/book" className="nav-link">Book</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;