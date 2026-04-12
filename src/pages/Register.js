import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registered Successfully");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }} className="d-flex justify-content-center align-items-center">

      <div className="card p-4 shadow-lg" style={{ width: "380px", borderRadius: "15px" }}>
        
        <h2 className="text-center text-primary mb-4">Create Account</h2>

        <form onSubmit={handleRegister}>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
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

          <button className="btn btn-primary w-100">
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;