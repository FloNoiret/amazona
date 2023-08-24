import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import { useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';

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
  const navigate = useNavigate();
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

  // Cart
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };
  // Product
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
           <button onClick={addToCartHandler} className="btn-gold">
             Ajouter au Panier
           </button>
        ) : (
          <Link to="/" className="btn-gold">Voir des produits similaires</Link>
        )}
      </div>
    </div>
  );
}

export default ProductScreen;
