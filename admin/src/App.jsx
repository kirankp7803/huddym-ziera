import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import SignIn from './pages/SignIn';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('adminAuth') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="admin-container">
          <AdminNavbar onLogout={handleLogout} />
          <main className="main-content container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<SignIn onLogin={handleLogin} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
