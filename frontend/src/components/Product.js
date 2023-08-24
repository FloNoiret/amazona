import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

// Btn Add to cart depending on stock
function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <div className="product" key={product.slug}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.slug}`}>
          <p>{product.name}</p>
        </Link>
        <Rating
          className="rating"
          rating={product.rating}
          numReviews={product.numReviews}
        />
        <p>
          <strong>{product.price} € </strong>
        </p>

        {product.countInStock === 0 ? (
          <button disabled>Rupture de Stock</button>
        ) : (
          <button className="btn-cart" onClick={() => addToCartHandler(product)}>
            Ajouter au Panier
          </button>
        )}
      </div>
    </div>
  );
}
export default Product;
