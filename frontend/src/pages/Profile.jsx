import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError("Authentication token or user ID not found.");
        return;
      }

      try {
        // Update the URL to include the user ID
        const response = await fetch(`http://127.0.0.1:8000/api/user-profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch credentials");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUser();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }


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
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
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
    <div className="d-flex flex-row gap-5">
      <div
        className="d-flex flex-column justify-content-between p-3"
        style={{ height: "80vh", backgroundColor: "#F3F2EC" }}
      >
        <div>
          <img src="" alt="" />
          <p className="fw-semibold">{user.username}</p>
          <p>{user.email}</p>
        </div>

       

        <div className="d-flex flex-column gap-4">
          <button className="btn d-flex align-items-center profile-button">
            <i className="fa-solid fa-bell text-black me-2"></i>
            Notification
          </button>
          <div>
            <button
              type="submit"
              className="btn d-flex align-items-center profile-button"
              onClick={handleSignOut}
            >
              <i className="fa-solid fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
      <div className="item">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;