import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mot de passes non identiques');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      alert(Error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="signin-page">

      <h1>Créer un Compte</h1>

      <form onSubmit={submitHandler}>
        <div className="signin-item" controlId="name">
          <label>Votre Nom</label>
          <input onChange={(e) => setName(e.target.value)} required />
        </div>

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

          <div className="signin-item" controlId="confirmPassword">
            <label>Confirmer le Mot de Passe</label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            </div>

        <div className="signin-item">
          <button type="submit" className='btn-gold'>Créer un compte</button>
        </div>
        <div className="signin-item">
          Déjà inscrit? {' '}
          <Link to={`/signin?redirect=${redirect}`}>Se Connecter</Link>
        </div>
      </form>
    </div>
  );
}