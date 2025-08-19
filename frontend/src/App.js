import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import StoreList from './components/StoreList';
import AdminDashboard from './components/AdminDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check for user data in localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.clear(); // Clear corrupted storage
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.access_token);
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Prevent flicker while checking auth state
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          
          {/* Main Redirect Logic */}
          <Route 
            path="/" 
            element={
              user ? (
                user.role === 'SYSTEM_ADMIN' ? <Navigate to="/admin" /> :
                user.role === 'STORE_OWNER' ? <Navigate to="/dashboard" /> :
                <StoreList />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={user && user.role === 'SYSTEM_ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/dashboard" 
            element={user && user.role === 'STORE_OWNER' ? <StoreOwnerDashboard /> : <Navigate to="/" />} 
          />

          {/* Fallback for any other route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;