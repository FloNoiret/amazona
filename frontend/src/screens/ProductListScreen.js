import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    // ADD Product
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };

      //Delete Product
      case 'DELETE_REQUEST':
        return { ...state, loadingDelete: true, successDelete: false };
      case 'DELETE_SUCCESS':
        return {
          ...state,
          loadingDelete: false,
          successDelete: true,
        };
      case 'DELETE_FAIL':
        return { ...state, loadingDelete: false, successDelete: false };
  
      case 'DELETE_RESET':
        return { ...state, loadingDelete: false, successDelete: false };


    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };

    //Delete Product
   if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  // ADD Product
  const createHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/products",
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      alert("product created successfully");
      dispatch({ type: "CREATE_SUCCESS" });
      navigate(`/admin/product/${data.product._id}`);
    } catch (err) {
      alert(getError(error));
      dispatch({
        type: "CREATE_FAIL",
      });
    }
  };

  //Delete Product
  const deleteHandler = async (product) => {
    if (window.confirm('Etes-vous sûre de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        alert('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        alert(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <div>
        <h1>Produits</h1>
      </div>
      <div>
        <button className="btn-gold" type="button" onClick={createHandler}>
          Créer un nouveau produit
        </button>
      </div>
      {loadingCreate && <p>Veuillez Patienter... Un nouveau produit est en cours de création</p>}
      {loadingDelete && <p>Veuillez patienter pendant que l'on supprime le produit...</p>}

      {loading ? (
        <p> Veuillez patienter... </p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table className="product-details">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOM</th>
                <th>PRIX</th>
                <th>CATEGORIE</th>
                <th>MARQUE</th>
                <th>STOCK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="order-details-items">{product._id}</td>
                  <td className="order-details-items">{product.name}</td>
                  <td className="order-details-items">{product.price}</td>
                  <td className="order-details-items">{product.category}</td>
                  <td className="order-details-items">{product.brand}</td>
                  <td className="order-details-items">{product.countInStock}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-gold product-actions"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="btn-inactive product-actions"
                      onClick={() => deleteHandler(product)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={
                  x + 1 === Number(page) ? "btn-gold " : "btn-inactive"
                }
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
