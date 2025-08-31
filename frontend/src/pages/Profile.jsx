import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="d-flex flex-row gap-5">
      <div
        className="d-flex flex-column justify-content-between p-3"
        style={{ height: "80vh", backgroundColor: "#F3F2EC" }}
      >
        <div>
          <img src="" alt="" style={{ width: "50px", height: "50px" }} />
        </div>

        <div>
          <p></p>
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
