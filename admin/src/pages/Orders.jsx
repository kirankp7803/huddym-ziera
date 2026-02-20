import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orders`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h2 className="page-title">Customer Orders</h2>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <h3>Order #{order.id}</h3>
                            <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="customer-details">
                            <h4>Customer Details</h4>
                            <p><strong>Name:</strong> {order.customer.name}</p>
                            <p><strong>Address:</strong> {order.customer.address}, {order.customer.city} {order.customer.pincode}</p>
                            <p style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e5e7eb' }}>
                                <strong>Payment:</strong> <span style={{ textTransform: 'uppercase', color: 'var(--primary-color)' }}>{order.customer.paymentMethod}</span>
                                {order.customer.paymentMethod === 'bank' && order.customer.transactionId && (
                                    <span style={{ display: 'block', fontSize: '0.85em', color: '#4b5563', marginTop: '0.25rem' }}>
                                        Txn ID: {order.customer.transactionId}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="order-items">
                            <h4>Ordered Items</h4>
                            <ul>
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="order-item">
                                        <span>{item.name}</span>
                                        <span>₹{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="order-total">
                                <strong>Total: ₹{order.total}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
