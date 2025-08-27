import { useEffect, useState } from "react";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [setError] = useState("");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#F3F2EC" }} className="flex-column">
        <div className="d-flex flex-row p-3 justify-content-between">
          {days.map((day) => (
            <div key={day} className="bg-white rounded-3 p-3 shadow ">
              <h4>{day}</h4>
            </div>
          ))}
        </div>

        <div>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.price}</td>
                  <td>{product.stocks?.quantity}</td>
                  <td>{product.expiration_date}</td>
                  <td>{product.category_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
