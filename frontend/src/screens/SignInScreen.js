import { Link, useLocation } from 'react-router-dom';

export default function SigninScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  return (
    <div className="signin-page">
      <h1>Sign In</h1>
      <form>
        <div className="signin-item" controlId="email">
          <label>Email</label>
          <input className="signin-input" type="email" required />
        </div>
        <div className="signin-item" controlId="password">
          <label>Password</label>
          <input className="signin-input" type="password" required />
        </div>
        <div className="signin-item">
          <button type="submit" className='btn-gold'>Sign In</button>
        </div>
        <div className="signin-item">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </form>
    </div>
  );
}