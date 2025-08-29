import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/Retrack.png";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [Token, setToken] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.Token);
        localStorage.setItem("username", data.User.username);
        setToken(data.Token);
        setUsername(data.User.username);
        setMessage(data.message || "Login Successfully.");
        navigate("/dashboard");
      } else {
        const errorMessage =
          data.message ||
          (data.errors && Object.values(data.errors).flat().join(";")) ||
          "An Unknown Error Occurred.";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <img src={logo} alt="" className="img-fluid w-25" />
                <h2
                  className="card-title text-uppercase fw-bold"
                  style={{ color: "darkblue" }}
                >
                  ADMIN
                </h2>
              </div>
              <form onSubmit={handleLogin}>
                {error && (
                  <div className="alert alert-danger text-center" role="alert">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="alert alert-success text-center" role="alert">
                    {message}
                  </div>
                )}
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-lg text-white"
                    style={{ background: "darkblue" }}
                  >
                    Login
                  </button>
                </div>
                <div className="d-flex justify-content-center">
                  <Link to="/retrieve">
                    <p>Forget Password?</p>
                  </Link>
                </div>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-lg text-white"
                    style={{ background: "darkblue" }}
                  >
                    <Link
                      to="/register"
                      className="text-decoration-none text-white"
                    >
                      Register
                    </Link>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
