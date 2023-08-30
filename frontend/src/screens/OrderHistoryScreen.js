import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <h1>Vos commandes passées</h1>
      {loading ? (
        <p></p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="product-details">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYÉ</th>
              <th>LIVRAISON</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className='order-details-items' >{order._id}</td>
                <td className='order-details-items' >{order.createdAt.substring(0, 10)}</td>
                <td className='order-details-items' >{order.totalPrice.toFixed(2)}</td>
                <td className='order-details-items' >{order.isPaid ? order.paidAt.substring(0, 10) : 'Non'}</td>
                <td className='order-details-items' >
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'Non'}
                </td>
                <td>
                  <button
                    type="button"
                    className='btn-gold product-actions'
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}