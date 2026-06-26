import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Return Policy</h1>
        <p>
          Thank you for shopping with ShopNest. If you are not completely satisfied with your purchase, we are here to help.
          You may return most items within 14 days of delivery for a full refund or exchange.
        </p>
        <p>
          To be eligible for a return, items must be unused, in the same condition that you received them, and in the original packaging.
          Some products may have specific return requirements, which will be noted on the product page.
        </p>
        <p>
          Once we receive your returned item, we will inspect it and notify you of the status of your refund.
          Refunds will be issued to the original payment method within 5-7 business days.
        </p>
        <p>
          For any questions about your return, please reach out to our support team through the About page.
        </p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default ReturnPolicy;
