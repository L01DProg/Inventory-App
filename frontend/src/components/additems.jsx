import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddItems = () => {
  const [product_name, setProductName] = useState("");
  const [category_name, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiration_date, setExpiration] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setMessage("");
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.warn("No authentication. Redirecting to login.");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("product_name", product_name);
    formData.append("category_name", category_name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("expiration_date", expiration_date);
    if (image) {
      formData.append("image", image);
    }

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage("Successfully added product!");
        setProductName("");
        setCategory("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setExpiration("");
        setImage(null);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to add product. Please try again."
        );
      }
    } catch (err) {
      console.error("Add item error:", err);
      setError("Failed to connect to the server. Please check your network.");
    }
  };

  return (
    <>
      <div
        className="container p-5 d-flex flex-column"
        style={{ backgroundColor: "white", height: "95vh" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-row gap-5 mb-3">
            <input
              type="text"
              id="product_name"
              value={product_name}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="w-50 form-control border-top-0 border-start-0 border-end-0 text-center"
              required
            />
            <input
              type="text"
              id="category"
              value={category_name}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-50 form-control border-top-0 border-start-0 border-end-0 text-center"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-100 form-control text-center"
              required
            />
          </div>

          <div className="d-flex flex-row gap-2 mb-3">
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-33 form-control text-center"
              required
            />

            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-33 form-control text-center"
              required
            />

            <input
              type="text"
              id="expiration_date"
              value={expiration_date}
              onChange={(e) => setExpiration(e.target.value)}
              placeholder="Expiration Date: mm/dd/yy"
              className="w-33 form-control text-center"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload Image:
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              className="form-control"
            />
          </div>

          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <button type="submit" className="btn btn-primary w-100">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default AddItems;
