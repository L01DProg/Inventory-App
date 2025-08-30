import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { App } from "antd";

const Dashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMessage("");
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.warn("No authentication. Redirecting to login.");
      navigate("/");
    }

    setIsLoading(false);
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("No authentication token found.");
        navigate("/");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`, // Corrected syntax
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        message.success("You have been successfully logged out."); // Use Antd's message
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to connect to the server for logout. Please try again.");
    }
  };

  return (
    <div className="d-flex flex-row">
      {isLoading && (
        <div className="flex justify-center items-center py-5 text-lg text-blue-500">
          <h4 className="text-center">Loading....</h4>
        </div>
      )}
      <div
        className="card w-25 d-flex flex-column p-3"
        style={{ height: "100vh", gap: "1rem" }}
      >
        <Link
          to="home"
          className="d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5"
        >
          <i className="fa-solid fa-house me-2" style={{ fontSize: "24px" }} />
          Home
        </Link>
        <Link
          to="shopping"
          className="d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5"
        >
          <i
            className="fa-solid fa-cart-shopping me-2"
            style={{ fontSize: "24px" }}
          />
          Shop
        </Link>
        <Link
          to="add-item"
          className="d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5"
        >
          <i
            className="fa-solid fa-clipboard-check me-2"
            style={{ fontSize: "24px" }}
          />
          Add Item
        </Link>
        <Link
          to="sales"
          className="d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5"
        >
          <i
            className="fa-solid fa-chart-bar me-2"
            style={{ fontSize: "24px" }}
          />
          Sales
        </Link>
        <Link
          to="profile"
          className="d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5"
        >
          <i className="fa fa-user me-2" style={{ fontSize: "24px" }} />
          Profile
        </Link>

        <button
          onClick={handleSignOut}
          className="btn btn-link d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5 p-0"
          style={{ textAlign: "left" }}
        >
          <i className="fa fa-power-off text-danger me-2" />
          Sign Out
        </button>

        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      <div className="flex-grow-1 p-3 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
