import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { getError } from "./utils";
import axios from "axios";

// DATA
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
// WEBSITE PAGE
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SignInScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignUpScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';

// Components
import SearchBox from "./components/Searchbox";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";

function App() {
  // cart & sign in React Context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Signout Removal local stored infos
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  // Side Bar
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        alert(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <header>
        <nav>
        
          <Link to="/" className="logo-nav">
            {" "}
            Amazona
          </Link>
          
          <div className="search-nav">
              <div>
                <ul className="category-nav">
                  <legend>Categories</legend>
                  {categories.map((category) => (
                    <li  key={category}>
                      <Link to={`/search?category=${category}`}>
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SearchBox />
              </div>
            </div>

            <div>
              <ul className="right-nav">
                <div>
                  <li className="sign-header">
                    <Link to="/cart" className="cart-header">
                      <p>Panier</p>
                      {cart.cartItems.length > 0 && (
                        <div className="cart-number">
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </div>
                      )}
                    </Link>
                  </li>
                </div>

                <div>
                  {userInfo ? (
                    <div title={userInfo.name} className="right-nav">
                      <li className="sign-header">
                        <Link to="/profile">
                          <p>Mon Compte</p>
                        </Link>
                      </li>
                      <li className="sign-header">
                        <Link to="/orderhistory">
                          <p>Commandes Passées</p>
                        </Link>
                      </li>
                      <li className="sign-header">
                        <Link
                          className="btn-gold"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link>
                      </li>
                    </div>
                  ) : (
                    <Link className="btn-gold" to="/signin">
                      Se Connecter
                    </Link>
                  )}
                </div>
                <div>
                  {/* Admin Nav */}
                  {userInfo && userInfo.isAdmin && (
                    <div>
                      <ul
                        className="admin-nav"
                        title="Admin"
                        id="admin-nav-dropdown"
                      >
                        <li className="sign-header">
                          <Link to="/admin/dashboard">Tableau de Bord</Link>
                        </li>
                        <li className="sign-header">
                          <Link to="/admin/products">Catalogue</Link>
                        </li>
                        <li className="sign-header">
                          {" "}
                          <Link to="/admin/order">Commandes</Link>
                        </li>
                        <li className="sign-header">
                          <Link to="/admin/user">Utilisateurs</Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/search" element={<SearchScreen />} />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            ></Route>
             <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;