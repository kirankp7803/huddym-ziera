import { Link } from 'react-router-dom';

const AdminNavbar = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="nav-brand">ShopAdmin</Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/inventory" className="nav-link">Inventory</Link>
                    <Link to="/orders" className="nav-link">Orders &amp; Customers</Link>
                    <button className="nav-logout-btn" onClick={onLogout} title="Sign out">
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
