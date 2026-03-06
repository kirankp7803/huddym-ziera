import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ onLogout }) => {
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
                <Link to="/" className="nav-brand">ShopAdmin</Link>
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/inventory" className="nav-link">Inventory</Link>
                    <Link to="/orders" className="nav-link">Orders & Customers</Link>

                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex' }}
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                        )}
                    </button>

                    <button className="nav-logout-btn" onClick={onLogout} title="Sign out" style={{ marginLeft: '0.5rem' }}>
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 4.293a1 1 0 011.414 1.414L13.414 10l1.293 1.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2zM13 10H7a1 1 0 100 2h6a1 1 0 100-2z" clipRule="evenodd" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
