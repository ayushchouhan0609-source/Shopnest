import React from 'react';
import { Link } from 'react-router-dom';

const Disclamier = () => {
  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Disclaimer</h1>
        <p>
          Welcome to ShopNest! The information provided on this website is for general informational purposes only.
          While we strive to keep content accurate and up to date, we cannot guarantee that all product details, prices, or availability are correct at all times.
        </p>
        <p>
          ShopNest is not responsible for any errors, omissions, or outcomes resulting from the use of this website.
          Any reliance you place on such information is strictly at your own risk.
        </p>
        <p>
          This website may contain links to third-party sites. These links are provided for convenience only and do not imply endorsement.
          ShopNest is not responsible for the content or privacy practices of external websites.
        </p>
        <p>
          If you have any questions, please visit our <Link to="/about">About</Link> page for more information.
        </p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default Disclamier;
