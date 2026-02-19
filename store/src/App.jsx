import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ScrollToTopButton from './components/ScrollToTopButton';
import './index.css';

function App() {
  return (
    <Router>
      <ScrollToTopButton />
      <div className="app-container">
        <Navbar />
        <main className="container main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/write-review" element={<WriteReview />} />
          </Routes>
        </main>
        <footer className="footer" style={{ marginTop: 'auto', background: '#27272a', color: 'white', padding: '3rem 2rem' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>ChicBoutique</h3>
              <p style={{ color: '#a1a1aa' }}>Elevating your style with traditional elegance and modern grace.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="/home" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Home</a>
                <a href="/shop" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Shop</a>
                <a href="/about" style={{ color: '#a1a1aa', textDecoration: 'none' }}>About Us</a>
                <a href="/contact" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Customer Service</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="/faq" style={{ color: '#a1a1aa', textDecoration: 'none' }}>FAQ</a>
                <a href="/shipping" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Shipping Policy</a>
                <a href="/returns" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Returns & Exchanges</a>
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
            <p>© {new Date().getFullYear()} ChicBoutique. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
