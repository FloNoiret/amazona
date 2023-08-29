import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, userInfo, orderId, navigate]);
  return loading ? (
    <p>Veuillez patienter...</p>
  ) : error ? (
    alert({ error })
  ) : (
    <div>
      <h1>Commande #{orderId}</h1>
      <section className="order-details">
        <ul className="order-details-preview">
          <li className="order-details-items">
            <h2>Adresse de Livraison</h2>
            <p>
              <strong>Name:</strong> {order.shippingAddress.fullName} <br />
              <strong>Address: </strong> {order.shippingAddress.address},
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <p>Livré le {order.deliveredAt}</p>
            ) : (
              <p>Non livré</p>
            )}
          </li>

          <li className="order-details-items">
            <h2>Paiement</h2>
            <p>Moyen utilisé: {order.paymentMethod}</p>
            {order.isPaid ? <p>Payé le {order.paidAt}</p> : <p>Non payé</p>}
          </li>

          <li className="order-details-items">
            <h2>Items</h2>
            {order.orderItems.map((item) => (
              <div key={item._id} className="order-details-products">
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-thumbnail"
                ></img>
                <h4>
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </h4>
                <p>Quantité :{item.quantity}</p>
                <p>{item.price} €</p>
              </div>
            ))}
          </li>
        </ul>

        <section className="order-info">
          <ul>
            <h2>Résumé de la commande</h2>

            <li>
              <h3>Items</h3>
              <p>{order.itemsPrice.toFixed(2)} €</p>
            </li>
            <hr></hr>
            <li>
              <h3>Livraison</h3>
              <p>{order.shippingPrice.toFixed(2)} €</p>
            </li>
            <hr></hr>
            <li>
              <h3>Taxes</h3>
              <p>{order.taxPrice.toFixed(2)} €</p>
            </li>
            <hr></hr>
            <li>
              <h3>
                <strong> Total</strong>
              </h3>
              <p>
                <strong>{order.totalPrice.toFixed(2)} €</strong>
              </p>
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}
