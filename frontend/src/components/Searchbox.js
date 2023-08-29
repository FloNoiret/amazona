import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
    e.target.reset();
};

return (
  <form onSubmit={submitHandler} className="sign-header">
    <div>
      <input
        type="text"
        name="q"
        id="q"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
        aria-label="Search Products"
        aria-describedby="button-search"
      ></input>
      <button className="gold-backgound" type="submit" id="button-search">
        <i className="fas fa-search"></i>
      </button>
    </div>
  </form>
);
}