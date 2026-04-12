import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("loggedIn");

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg premium-navbar px-3">
      <div className="container">

        <Link to="/" className="navbar-brand logo-text">
          🏥 Medinova
        </Link>

        <div className="navbar-nav ms-auto align-items-center">

          <Link to="/" className="nav-link nav-item-custom">Home</Link>
          <Link to="/book" className="nav-link nav-item-custom">Book</Link>

          {isLoggedIn && (
            <Link to="/appointments" className="nav-link nav-item-custom">
              Appointments
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="nav-link nav-item-custom">Login</Link>
              <Link to="/register" className="nav-link nav-item-custom">Register</Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <span className="user-name ms-3">
                👋 {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="btn logout-btn ms-3"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;