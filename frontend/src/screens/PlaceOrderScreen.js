import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { getError } from '../utils';

// Complete Order
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

// Display Place Order
export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  // Complete Order
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  // Display Order
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  // Complete Order
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      alert(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

      <h1>Aperçu de la commande</h1>
      
      <section className="order-details">
        <ul className="order-details-preview">
          <li className="order-details-items">
            <h2>Livraison</h2>
            <p>
              {cart.shippingAddress.fullName} <br />
              {cart.shippingAddress.address},{cart.shippingAddress.city},{" "}
              {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
            </p>
            <Link to="/shipping">Modifier</Link>
          </li>

          <li className="order-details-items">
            <h2>Paiement</h2>
            <p>{cart.paymentMethod}</p>
            <Link to="/payment">Modifier</Link>
          </li>

          <li className="order-details-items ">
            <h2>Items</h2>

              {cart.cartItems.map((item) => (
                <div key={item._id} className="order-details-products">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-thumbnail"
                  ></img>{" "}
                  <h4>
                  <Link to={`/product/${item.slug}`}>{item.name}</Link></h4>
                  <p>Quantité: {item.quantity}</p>
                  <p>{item.price} €</p>
                </div>
              ))}
            <Link to="/cart">Modifier</Link>
          </li>
        </ul>

        <section className="order-info">
          <ul>
            <h2>Résumé de la commande</h2>
            <li>
              <h3>Items</h3>
              <p>{cart.itemsPrice.toFixed(2)} €</p>
            </li>

            <hr></hr>
            <li>
              <h3>Livraison</h3>
              <p>{cart.shippingPrice.toFixed(2)} €</p>
            </li>
            <hr></hr>
            <li>
              <h3>Taxe</h3>
              <p>{cart.taxPrice.toFixed(2)} €</p>
            </li>

            <hr></hr>
            <li>
              <h3>
                <strong>Total</strong>
              </h3>
              <p>
                <strong>{cart.totalPrice.toFixed(2)} €</strong>
              </p>
            </li>
            <button
              className="btn-gold"
              type="button"
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}
            >
              Commander
            </button>
            {loading && <p>Loading...</p>}
          </ul>
        </section>
      </section>
    </div>
  );
}
