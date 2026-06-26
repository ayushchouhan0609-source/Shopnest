import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Product.css';

const ProductCard = ({ product }) => {
  const imageSrc = product.imageUrl && product.imageUrl.startsWith('http')
    ? product.imageUrl
    : 'https://via.placeholder.com/500x400?text=Product+Image';

  return (
    <div className="product-card">
     <img src={imageSrc} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price.toFixed(2)}</p>
      <Link to={`/product/${product._id}`} className="btn">View Details</Link>
    </div>
  );
};

export default ProductCard;