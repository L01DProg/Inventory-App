import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// The component name should start with a capital letter (e.g., AdminInformation).
// It should also not be an async function.
const AdminInformation = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // This inner async function is unnecessary.
    const handleImage = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.error("Unauthenticated, please login.");
        navigate("/");
      }

      try{
        const response = await fetch('http://127.0.0.1:8000/api/edit-profile',{
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${authToken}` 
          }
        });

        if(!response.ok) {
          throw new Error("Error fetching data");
          return;
        }

        
      }
    };
    
    // Call the function inside the useEffect
    handleImage();
  }, [navigate]); // Add `Maps` to the dependency array

  // The return block should always be the last part of a component function.
  return (
    <div className="d-flex flex-row">
      <div className="form">
        <form action="" method="PUT">
          <input type="file" />
        </form>
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default AdminInformation;