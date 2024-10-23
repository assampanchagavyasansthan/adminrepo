// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/fierbase'; // Adjust this import as needed
import UploadForm from './components/uploadmanual';
import OrdersPage from './components/orders';
import DisplayProducts from './components/inventory';
import LogIn from './components/login';
import SignUp from './components/signeup';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // State to hold the user's email

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set authentication state based on user presence
      setUserEmail(user?.email || null); // Set user email if user is logged in
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/login">Admin</Link>
          </li>
          <li>
            <Link to="/uploadmanual">Upload</Link>
          </li>
          <li>
            <Link to="/orders">Order</Link>
          </li>
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          {/* Display the user's email if authenticated */}
          {isAuthenticated && userEmail && (
            <li>
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>Welcome, {userEmail}</span>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        {/* Redirect root path to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signeup" element={<SignUp />} />
        {/* Protect these routes */}
        <Route path="/uploadmanual" element={isAuthenticated ? <UploadForm /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/inventory" element={isAuthenticated ? <DisplayProducts /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
