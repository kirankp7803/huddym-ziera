import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/products`),
                    axios.get(`${API_BASE_URL}/orders`)
                ]);
                setStats({
                    products: productsRes.data.length,
                    orders: ordersRes.data.length
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="page-title">Dashboard</h1>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="stat-card" style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>Total Products</h3>
                    <p className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.products}</p>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>Total Orders</h3>
                    <p className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.orders}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
