import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

function HomeScreen() {

  // Fetch Prodeuct from Backend
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/products');
      setProducts(result.data);
    };
    fetchData();
  }, []);

// Show list of Product
  return (
    <div>

      <h1> Featured Products</h1>

      <div className="products">

        {products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>{product.price} € </strong>
              </p>
              
              <button>Ajouter au panier</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
export default HomeScreen;
