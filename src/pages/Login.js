import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    // If no user registered
    if (!user) {
      alert("❌ Please register first");
      return;
    }

    // Check email & password
    if (email === user.email && password === user.password) {
      alert("✅ Login Successful");

      // mark as logged in
      localStorage.setItem("loggedIn", "true");

      // redirect to dashboard
      navigate("/dashboard");
    } else {
      alert("❌ Invalid email or password");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className="card p-4 shadow-lg"
        style={{ width: "380px", borderRadius: "15px" }}
      >
        <h2 className="text-center text-primary mb-4">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;