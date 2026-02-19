import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="nav-brand">ShopAdmin</Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/inventory" className="nav-link">Inventory</Link>
                    <Link to="/orders" className="nav-link">Orders & Customers</Link>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
