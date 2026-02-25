import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import WriteReview from './pages/WriteReview';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import ScrollToTopButton from './components/ScrollToTopButton';
import './index.css';

// Check if user is logged in from localStorage
const isUserLoggedIn = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!(user && user.loggedIn);
  } catch {
    return false;
  }
};

// Protected Route — redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  return isUserLoggedIn() ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);

  // Called by Login / Signup pages after successful auth
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  // Called by Navbar logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <ScrollToTopButton />
      <div className="app-container">
        {isLoggedIn && <Navbar onLogout={handleLogout} />}

        <main
          className={`container ${isLoggedIn ? 'main-content' : ''}`}
          style={
            !isLoggedIn
              ? { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }
              : {}
          }
        >
          <Routes>
            {/* Public Routes - redirect to /home if already logged in */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/home" replace /> : <Login onAuthSuccess={handleAuthSuccess} />}
            />
            <Route
              path="/signup"
              element={isLoggedIn ? <Navigate to="/home" replace /> : <Signup onAuthSuccess={handleAuthSuccess} />}
            />

            {/* Default — go to login if not logged in, home if logged in */}
            <Route
              path="/"
              element={<Navigate to={isLoggedIn ? '/home' : '/login'} replace />}
            />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/write-review" element={<ProtectedRoute><WriteReview /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {isLoggedIn && (
          <footer className="footer" style={{ marginTop: 'auto', background: '#27272a', color: 'white', padding: '3rem 2rem' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>Huddym Ziera</h3>
                <p style={{ color: '#a1a1aa' }}>Elevating your style with traditional elegance and modern grace.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Quick Links</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="/home" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Home</a>
                  <a href="/shop" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Shop</a>
                  <a href="/about" style={{ color: '#a1a1aa', textDecoration: 'none' }}>About Us</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Customer Service</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="/faq" style={{ color: '#a1a1aa', textDecoration: 'none' }}>FAQ</a>
                  <a href="/shipping" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Shipping Policy</a>
                  <a href="/returns" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Returns &amp; Exchanges</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Connect With Us</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="#" style={{ color: 'white' }}>Instagram</a>
                  <a href="#" style={{ color: 'white' }}>Facebook</a>
                  <a href="#" style={{ color: 'white' }}>Twitter</a>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #3f3f46', color: '#71717a' }}>
              <p>© {new Date().getFullYear()} Huddym Ziera. All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
