import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantities, setQuantities] = useState({});

  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.error("Invalid Unauthorized, please log in");
      navigate("/");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Search Logic
  const searchProducts = async (term) => {
    const authToken = localStorage.getItem("authToken");
    if (!term.trim()) {
      fetchProducts();
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      const response = await fetch(
        `http://127.0.0.1:8000/api/search-product?query=${encodeURIComponent(
          term
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchProducts();
    } else {
      searchProducts(term);
    }
  };

  // Delete products Logic
  const deleteProduct = async (productId) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Buy Product Logic
  const buyProduct = async (productId) => {
    const authToken = localStorage.getItem("authToken");
    const quantity = quantities[productId] || 0;

    if (!authToken) {
      setError("Invalid to purchase products. Authentication token missing.");
      navigate("/");
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Please enter a valid quantity greater than zero.");
      return;
    }

    try {
      const cartItems = [{ product_id: productId, quantity: Number(quantity) }];

      const response = await fetch("http://127.0.0.1:8000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          cart_items: cartItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase product.");
      }

      console.log("Purchase successful!");
      setIsSuccess(true);
      setError("");

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      setQuantities((prev) => ({ ...prev, [productId]: "" }));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  return (
    <div className="container py-4 bg-white overflow-auto">
      {/* Moved the success modal inside the main container to fix the JSX structure */}
      {isSuccess && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="successTitle"
          aria-hidden={!isSuccess}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0 justify-content-center">
                <h5
                  className="modal-title fs-4 fw-bold text-success"
                  id="successTitle"
                >
                  Success!
                </h5>
              </div>
              <div className="modal-body text-center pt-2">
                <p id="successDesc">Purchase product Successfully.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="mb-4 text-center">Products</h2>
      <div className="mb-4" style={{ width: "500px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {(isLoading || isSearching) && (
        <div className="flex justify-center items-center py-5 text-lg text-blue-500">
          <h4 className="text-center">Loading....</h4>
        </div>
      )}

      {!isLoading && !isSearching && products.length === 0 && !error && (
        <div className="text-center py-5">
          <h4>No products found</h4>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {products.map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 shadow-sm border-0 rounded-3">
              {p.image ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${p.image}`}
                  className="card-img-top"
                  alt={p.product_name}
                  style={{
                    height: "160px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: "160px" }}
                >
                  No image
                </div>
              )}

              <div className="card-body text-center">
                <h6 className="card-title fw-bold">{p.product_name}</h6>
                <p className="text-muted small mb-1">{p.description}</p>
                <p className="fw-semibold">₱{p.price}</p>
                <p className="text-muted small">Stock: {p.stocks?.quantity}</p>
                <p className="text-muted small mb-1">
                  Expiration Date: {p.expiration_date}
                </p>
              </div>

              <div className="card-footer d-flex justify-content-between align-items-center bg-white">
                <input
                  type="number"
                  placeholder="Quantity"
                  id={`quantity-${p.id}`}
                  className="text-center rounded-5"
                  style={{ width: "100px" }}
                  value={quantities[p.id] || ""}
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                />
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => buyProduct(p.id)}
                >
                  Buy
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductView;
