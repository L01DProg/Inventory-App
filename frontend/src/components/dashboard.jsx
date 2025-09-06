import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setError("");
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.warn("No authentication. Redirecting to login.");
      navigate("/");
    }

    setIsLoading(false);
  }, [navigate]);

  return (
    <div className="d-flex flex-row">
      {isLoading && (
        <div className="flex justify-center items-center py-5 text-lg text-blue-500">
          <h4 className="text-center">Loading....</h4>
        </div>
      )}
      <div
        className="card  d-flex flex-column p-3"
        style={{ height: "82vh", gap: "1rem" }}
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
          to="/profile"
          className="d-flex align-items-center fw-semibold text-decoration-none text-dark fs-5"
        >
          <i className="fa fa-user me-2" style={{ fontSize: "24px" }} />
          Profile
        </Link>

        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      <div className="flex-grow-1 p-3 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
