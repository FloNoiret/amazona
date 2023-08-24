import { useContext } from "react";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  // btn + and - update cart
  const updateCartHandler = async (item, quantity) => {
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
  // btn trash remove
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  // Redirect to signIn page when btn paiement is clicked
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  // Website page
  return (
    <div>
      <h1>Votre Panier</h1>
      <section>
        {cartItems.length === 0 ? (
          <div>
            Le panier est vide. <Link to="/">Faire du shopping</Link>
          </div>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <ul className="cart-details">
                  <li className="cart-details-items">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-thumbnail"
                    ></img>{" "}
                  </li>
                  <li className="cart-details-items">
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </li>

                  <li className="cart-details-items">
                    <button
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <i className="fas fa-minus-circle"></i>
                    </button>{" "}
                    <span>{item.quantity}</span>{" "}
                    <button
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      disabled={item.quantity === item.countInStock}
                    >
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </li>
                  <li className="cart-details-items">{item.price} €</li>
                  <li>
                    <button onClick={() => removeItemHandler(item)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <div>
          <div>
            <ul>
              <li>
                <h3>
                  Total ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
                  :  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} €
                </h3>
              </li>
              <li>
                <div className="d-grid">
                  <button
                    onClick={checkoutHandler}
                    type="button"
                    className="btn-gold"
                    disabled={cartItems.length === 0}
                  >
                    Procéder au Paiement
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
