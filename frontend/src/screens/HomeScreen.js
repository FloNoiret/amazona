import { Link } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Rating from "../components/Rating";

// Reducer Hook
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });

  // Fetch Product from Backend
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // const result = await axios.get('/api/products');

      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
      // setProducts(result.data);
    };
    fetchData();
  }, []);

  // Show list of Product
  return (
    <div>
      <h1> Featured Products</h1>

      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <Rating class="rating" rating={product.rating} numReviews={product.numReviews}/>
                <p>
                  <strong>{product.price} € </strong>
                </p>

                <button class="btn-cart">Ajouter au panier</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
