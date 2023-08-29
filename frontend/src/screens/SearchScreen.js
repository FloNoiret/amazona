import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Rating from '../components/Rating';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '1€ to 50€',
    value: '1-50',
  },
  {
    name: '51€ to 200€',
    value: '51-200',
  },
  {
    name: '201€ to 1000€',
    value: '201-1000',
  },
];

export const ratings = [ {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

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
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <section className='search-page' >
        <div className='search-filter' >
          <h3>Catégorie</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-active' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Aucune
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-active' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Prix</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-active' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Sans importance
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'text-active' : ''}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avis Moyen</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'text-active' : ''}
                  >
                    <Rating caption={' et plus'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'text-active' : ''}
                >
                  <Rating caption={'et plus'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='search-results-side'>
          {loading ? (
            <p>Veuillez patientez..</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <div className="search-results">
                <div className='search-results'>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Resultats
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Prix entre ' + price +'€'}
                    {rating !== 'all' && ' : Avis supérieur à ' + rating }
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <button
                        className='btn-gold filter-results'
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    ) : null}
                  </div>
                </div>
                <hr></hr>
                <div className='search-results '>
                  Sort by
                  <select className='filter-results'
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Nouveautés</option>
                    <option value="lowest">Prix: croissant</option>
                    <option value="highest">Prix: décroissant</option>
                    <option value="toprated">Avis Moyen</option>
                  </select>
                </div>
              </div>
              {products.length === 0 && (
                <p>Aucun produit ne correspond à vos critères</p>
              )}

              <div className='search-results'>
                {products.map((product) => (
                  <div  key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
              </div>

              <div className='pagination'>
                {[...Array(pages).keys()].map((x) => (
                  <Link key={x + 1}
                  className="mx-1"
                  to={getFilterUrl({ page: x + 1 })}
                >
                  <button
                    className={Number(page) === x + 1 ? 'btn-gold' : 'btn-inactive'}
                  >
                    {x + 1}
                  </button>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  </div>
);
}