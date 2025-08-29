import { useEffect, useState } from "react";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = async () => {
    const authToken = localStorage.getItem("authToken");

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

  return (
    <div className="container py-4 bg-white overflow-auto">
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
                <button className="btn btn-sm btn-outline-primary">
                  + Add
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Edit Item
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
