import { Link, useLocation } from 'react-router-dom';

export default function SigninScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  return (
    <div className="signin-page">
      <h1>Se Connecter</h1>
      <form>
        <div className="signin-item" controlId="email">
          <label>Email</label>
          <input className="signin-input" type="email" required />
        </div>
        <div className="signin-item" controlId="password">
          <label>Mot de Passe</label>
          <input className="signin-input" type="password" required />
        </div>
        <div className="signin-item">
          <button type="submit" className='btn-gold'>Se Connecter</button>
        </div>
        <div className="signin-item">
          Nouveau client?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Créer un compte</Link>
        </div>
      </form>
    </div>
  );
}