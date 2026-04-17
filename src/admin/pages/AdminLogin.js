import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/adminService";
import { isAdminAuthed, setAdminToken } from "../auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const loc = useLocation();

  if (isAdminAuthed()) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminLogin(username, password);
      setAdminToken(res?.token || "");
      const redirectTo = (loc.state && loc.state.from) || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#0b1220" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="card p-4 shadow-lg" style={{ width: 420, borderRadius: 16 }}>
        <h3 className="mb-1">Admin Login</h3>
        <div className="text-muted mb-3">Use the admin credentials to continue.</div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

