import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";

export default function SigninScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();

  // Signin button action
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      alert('Identifiant ou Mot de passe invalide');
    }
  };

  // Use Effect to redirect user to home page if try to access signin page while being connected. 
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="signin-page">
      <h1>Se Connecter</h1>
      <form onSubmit={submitHandler}>
        <div className="signin-item" controlId="email">
          <label>Email</label>
          <input
            className="signin-input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="signin-item" controlId="password">
          <label>Mot de Passe</label>
          <input
            className="signin-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="signin-item">
          <button type="submit" className="btn-gold">
            Se Connecter
          </button>
        </div>
        <div className="signin-item">
          Nouveau client?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Créer un compte</Link>
        </div>
      </form>
    </div>
  );
}
