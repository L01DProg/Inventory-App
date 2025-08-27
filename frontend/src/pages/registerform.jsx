import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Registration successful!");
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('');

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please check your network and try again.");
      console.error("Network error:", err);
    }
  };

  return (
    
    <div className="d-flex align-items-center justify-content-center vh-100  p-4" style={{backgroundColor: 'darkblue'}}>
      <div className="card shadow-lg p-4 col-12 col-md-8 col-lg-5">
        <div className="card-body">
          <h2 className="card-title text-center mb-4" style={{color:"yellow"}}><span style={{color:"orangered"}}>Create</span> <span style={{color:"darkblue"}}>an</span> Account</h2>

          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="form-label">Role</label>
              <input
                id="role"
                type="text"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn text-white" style={{backgroundColor:"darkblue"}}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}