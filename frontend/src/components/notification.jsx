import { useNavigate } from "react-router-dom";


const Notification = () => {
  const navigate = useNavigate();

  
    const navigateDashboard = () => {
      navigate("/dashboard");
    };

  return (
    <>
      <div className="d-flex flex-row">
        <div>
          <button className="text-dark fw-semibold" style={{borderRadius:"5px", border: "none"}} onClick={navigateDashboard}>
            <i className="fa fa-arrow-left"></i>Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Notification;
