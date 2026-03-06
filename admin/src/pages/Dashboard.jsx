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
                <div className="stat-card" style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Total Products</h3>
                    <p className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>{stats.products}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Total Orders</h3>
                    <p className="stat-value" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0 }}>{stats.orders}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
