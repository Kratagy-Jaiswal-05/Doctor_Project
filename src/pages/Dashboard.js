import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("loggedIn");

  // अगर login नहीं है तो redirect
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      
      <div className="container mt-5">

        <div className="card p-4 shadow-lg text-center" style={{ borderRadius: "15px" }}>
          
          <h2 className="text-primary">
            Welcome, {user?.name} 👋
          </h2>

          <p className="mt-3">
            You can now book appointments with top doctors in your city.
          </p>

          <div className="mt-4">

            <button
              className="btn btn-primary me-3"
              onClick={() => navigate("/book")}
            >
              Book Appointment
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/appointments")}
            >
              View Appointments
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;