import { useEffect, useState } from "react";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
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
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container py-4 bg-white overflow-auto">
      <h2 className="mb-4">Products</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {products.map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 shadow-sm border-0 rounded-3">
              {/* Image */}
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

              {/* Card Body */}
              <div className="card-body text-center">
                <h6 className="card-title fw-bold">{p.product_name}</h6>
                <p className="text-muted small mb-1">{p.description}</p>
                <p className="fw-semibold">₱{p.price}</p>
                <p className="text-muted small">Stock: {p.stock?.quantity}</p>
              </div>

              {/* Actions */}
              <div className="card-footer d-flex justify-content-between align-items-center bg-white">
                <button className="btn btn-sm btn-outline-primary">
                  + Add
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Edit Item
                </button>
                <button className="btn btn-sm btn-outline-danger">♥</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductView;
