import axios from "axios";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import Rating from "../components/Rating";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  // Reducer Hook
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  // Fetch Product from Backend
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

  return loading ? (
    <div> Loading... </div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    // Display
    <div className="page-product">
      <img className="large-img" src={product.image} alt={product.name}></img>
      <div className="product-details">
        <p>{product.name}</p>
        <Rating
          className="rating"
          rating={product.rating}
          numReviews={product.numReviews}
        />

        <p>{product.description}</p>
        <div>
          {product.countInStock > 0 ? (
            <p>
              <strong>{product.price} € </strong>
            </p>
          ) : (
            <p className="unavailbale-product">Produit indisponible</p>
          )}
        </div>
        {product.countInStock > 0 ? (
          <button className="btn-cart">Ajouter au panier</button>
        ) : (
          <button className="btn-cart">Voir des produits similaires</button>
        )}
      </div>
    </div>
  );
}

export default ProductScreen;
