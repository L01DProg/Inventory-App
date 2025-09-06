import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [totalSales, setTotalSales] = useState("");
  const [totalRevenue, setRevenue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect is necessary for side effects like data fetching.
  useEffect(() => {
    const fetchTotalSales = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Invalid or unauthenticated user.");
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/total-sales", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get total sales.");
        }

        const data = await response.json();
        setTotalSales(data.total_sales);
        console.log("Successfully fetched total sales.");
      } catch (err) {
        setError(err.message || "Server Error");
      }
    };

    fetchTotalSales();
  }, [navigate]);

  useEffect(() => {
    const fetchRevenue = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/sales-revenue",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error Fetching Revenue");
        }

        const data = await response.json();
        setRevenue(data.revenue);
        console.log("Successfully fetched total Revenue.");
      } catch (err) {
        setError(err.message || "Server Error");
      }
    };

    fetchRevenue();
  });

  const navigateDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="d-flex flex-column bg-white">
      <div className="p-2">
        <button
          className="text-primary bg-dark fw-semibold"
          style={{ borderRadius: "5px", border: "none" }}
          onClick={navigateDashboard}
        >
          <i className="fa fa-arrow-left"></i>Back
        </button>
      </div>
      {error && <div className="text-danger">{error}</div>}
      <div className="d-flex flex-row p-2 gap-5">
        <div className="card p-2 shadow-lg" style={{ border: "none" }}>
          <h5>Total Sales</h5>
          <p className="text-center fw-semibold">
            <i className="fa fa-peso-sign"></i>
            {totalSales || "0"}
          </p>
        </div>

        <div className="card p-2 shadow-lg" style={{ border: "none" }}>
          <h5>Total Revenue</h5>
          <p className="text-center fw-semibold">
            <i className="fa fa-peso-sign"></i>{totalRevenue || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
