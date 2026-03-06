import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const [cartCount, setCartCount] = useState(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.length;
    });

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
    };

    useEffect(() => {
        const handleCartUpdate = () => {
            updateCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        // Also listen for storage events in case tabs interact (optional but good practice)
        window.addEventListener('storage', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') !== 'light';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <button
                    className="icon-btn mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>

                <Link to="/home" className="nav-brand">
                    Huddym Zeira
                </Link>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                </div>

                <div className="nav-icons">
                    <button
                        className="icon-btn"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link to="/wishlist" className="icon-btn">
                        <Heart size={20} />
                    </Link>
                    <Link to="/cart" className="icon-btn cart-icon-wrapper">
                        <ShoppingBag size={20} />
                        <span className="cart-badge">{cartCount}</span>
                    </Link>
                    <Link to="/profile" className="icon-btn" title="My Profile">
                        <User size={20} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
