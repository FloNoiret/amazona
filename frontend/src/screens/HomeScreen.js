import { Link } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Rating from "../components/Rating";
import { Store } from "../Store";
import Product from "../components/Product";

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
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
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
      <h1> Produits Populaires </h1>

      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => 
          <Product product={product}></Product>)
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
