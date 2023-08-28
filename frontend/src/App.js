import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SignInScreen";
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from "./screens/SignUpScreen";

function App() {
  // cart & sign in React Context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Signout
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem('shippingAddress');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <Link to="/"> Amazona</Link>
          <nav>
            <Link to="/cart" className="cart-header">
              <div>Panier</div>
              {cart.cartItems.length > 0 && (
                <div className="cart-number">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </div>
              )}
            </Link>
            </nav>
          <div className="sign-header">
            {userInfo ? (
              <div title={userInfo.name} className="sign-header">
                <Link to="/profile" >
                  <div>Mon Compte</div>
                </Link>
                <Link to="/orderhistory">
                  <div>Commandes Passées</div>
                </Link>
                <Link
                  className="btn-gold"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </div>
            ) : (
              <Link className="btn-gold" to="/signin">
                Se Connecter
              </Link>
            )}
          </div>
          
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
                <Route path="/signup" element={<SignupScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
