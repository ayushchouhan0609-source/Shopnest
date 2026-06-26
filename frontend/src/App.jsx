import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Disclamier from './pages/Disclamier';
import ReturnPolicy from './pages/ReturnPolicy';
import Login from './pages/Login';
import Register from './pages/Register';

import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import AddProduct from './admin/AddProduct';
import AdminDashboard from './admin/AdminDashboard';
import Profile from './pages/Profile';
import AdminOrder from './admin/AdminOrder';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import EditProducts from './admin/EditProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

import './styles/global.css';

function App() {
  return (
   <Router>
    <Navbar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/disclaimer" element={<Disclamier />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrder />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/edit-product/:id" element={<EditProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/return" element={<ReturnPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/product/:id" element={<ProductDetails />} />
        
        
      </Routes>
    </main>
    <Footer />
   </Router>
  );
}

export default App;
