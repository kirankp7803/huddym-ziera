import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Package, Clock, MapPin, Phone, Mail, ArrowLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.loggedIn) {
            navigate('/login');
            return;
        }
        setUser(userData);

        const fetchData = async () => {
            try {
                const identifier = userData.email || userData.mobile;

                // Fetch Profile for addresses
                const profileRes = await axios.get(`${API_BASE_URL}/user/profile/${identifier}`);
                setAddresses(profileRes.data.addresses || []);

                // Fetch Orders
                const ordersRes = await axios.get(`${API_BASE_URL}/orders/user/${identifier}`);
                const sortedOrders = ordersRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const calculateDeliveryDate = (orderDate) => {
        const date = new Date(orderDate);
        date.setDate(date.getDate() + 7); // Assume 7 days delivery
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) return <div className="loading">Loading your profile...</div>;

    return (
        <div className="profile-page-container">
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <button
                    onClick={() => navigate('/home')}
                    className="back-btn"
                    style={{ marginBottom: '2rem' }}
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>

                <div className="profile-grid">
                    {/* User Info Section */}
                    <div className="user-info-card">
                        <div className="profile-header">
                            <div className="avatar-large">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h1 className="user-name">{user?.name}</h1>
                                <p className="user-status">Valued Member</p>
                            </div>
                        </div>

                        <div className="info-details-list">
                            <div className="info-item">
                                <Mail size={20} className="info-icon" />
                                <div>
                                    <p className="info-label">Email Address</p>
                                    <p className="info-value">{user?.email || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Phone size={20} className="info-icon" />
                                <div>
                                    <p className="info-label">Phone Number</p>
                                    <p className="info-value">{user?.mobile || user?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <MapPin size={20} className="info-icon" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p className="info-label">Primary Address</p>
                                        <button
                                            onClick={() => navigate('/addresses')}
                                            style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}
                                        >
                                            Manage
                                        </button>
                                    </div>
                                    <p className="info-value" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                        {addresses.length > 0
                                            ? `${addresses[0].address}, ${addresses[0].city}`
                                            : 'No address added yet'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ marginTop: '2rem', width: '100%' }}
                            onClick={() => {
                                localStorage.removeItem('user');
                                window.location.href = '/';
                            }}
                        >
                            Logout Account
                        </button>
                    </div>

                    {/* Orders History Section */}
                    <div className="orders-section">
                        <h2 className="section-title">
                            <Package size={24} style={{ marginRight: '0.75rem' }} />
                            Order History
                        </h2>

                        {orders.length === 0 ? (
                            <div className="empty-orders">
                                <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>You haven't placed any orders yet.</p>
                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '1rem' }}
                                    onClick={() => navigate('/shop')}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card-compact">
                                        <div className="order-card-header">
                                            <div className="order-meta">
                                                <p className="order-number">Order #{order.id.toString().slice(-6)}</p>
                                                <p className="order-date">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <div className="order-status-badge status-pending">
                                                {order.status || 'Processing'}
                                            </div>
                                        </div>

                                        <div className="order-items-preview">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="order-item-thumb"
                                                    title={item.name}
                                                />
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="more-items-badge">+{order.items.length - 3}</div>
                                            )}
                                        </div>

                                        <div className="order-delivery-info">
                                            <Clock size={16} />
                                            <span>Est. Delivery: <strong>{calculateDeliveryDate(order.date)}</strong></span>
                                        </div>

                                        <div className="order-card-footer">
                                            <p className="order-total-price">₹{order.total?.toLocaleString('en-IN')}</p>
                                            <button
                                                className="view-details-link"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                Details <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details</h3>
                            <button className="close-modal" onClick={() => setSelectedOrder(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="order-details-body">
                            <div className="detail-row">
                                <span className="label">Order ID:</span>
                                <span className="value">#{selectedOrder.id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Date:</span>
                                <span className="value">{new Date(selectedOrder.date).toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Status:</span>
                                <span className="order-status-badge status-pending">{selectedOrder.status || 'Processing'}</span>
                            </div>

                            <hr />

                            <h4>Items</h4>
                            <div className="modal-items-list">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="modal-item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="item-info">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-price">₹{item.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr />

                            <div className="shipping-details">
                                <h4>Shipping Address</h4>
                                <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                <p>{selectedOrder.customer.address}</p>
                                <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
                                <p>Phone: {selectedOrder.customer.phone}</p>
                            </div>

                            <div className="modal-footer">
                                <div className="total-box">
                                    <span>Total Amount</span>
                                    <span className="total-price">₹{selectedOrder.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
