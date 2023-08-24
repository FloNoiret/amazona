import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from './screens/CartScreen';
import SigninScreen from "./screens/SignInScreen";

function App() {
  // cart React Context
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <Link to="/"> Amazona</Link>
          <nav>
            <Link to="/cart" className="cart-icone">
             <div>Panier</div> {cart.cartItems.length > 0 && <div className="cart-number">{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</div>}
            </Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
