import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { setAdminToken } from "./auth";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    setAdminToken("");
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell d-flex">
      <aside className="admin-sidebar p-3">
        <div className="brand fs-5 mb-4">Admin Portal</div>

        <nav className="d-grid gap-2">
          <NavLink
            end
            to="/admin"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/doctors"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
          >
            Doctors
          </NavLink>
          <NavLink
            to="/admin/appointments"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
          >
            Appointments
          </NavLink>
        </nav>

        <div className="mt-4">
          <button onClick={logout} className="btn btn-outline-light w-100">
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-content d-flex flex-column">
        <div className="admin-topbar px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-semibold">Doctor Appointment Admin</div>
            <div className="text-muted small">Manage doctors & appointments</div>
          </div>
        </div>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

