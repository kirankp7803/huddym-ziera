import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${API_BASE_URL}/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Inventory...</div>;

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontFamily: 'serif' }}>Inventory Management</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>Manage your product listings, prices, and stock levels.</p>
                </div>
                <Link
                    to="/add-product"
                    style={{
                        padding: '0.75rem 1.25rem',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                        color: 'white',
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                        transition: 'transform 0.2s',
                        justifyContent: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add New Product
                </Link>
            </div>

            <div style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#374151' }}>Product</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#374151' }}>Category</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#374151' }}>Price</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#374151' }}>Stock</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#374151' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...products].reverse().map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={product.image} alt="" style={{ width: '56px', height: '56px', borderRadius: '0.75rem', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#111827' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>ID: #{product.id.toString().slice(-6)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', background: '#eef2ff', color: '#4f46e5', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ fontWeight: 'bold', color: '#111827' }}>₹{product.price}</div>
                                    {product.discountPrice && (
                                        <div style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'line-through' }}>₹{product.discountPrice}</div>
                                    )}
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            <span>{product.count || 0} left</span>
                                        </div>
                                        <div style={{ width: '80px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', position: 'relative' }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: 0, top: 0, bottom: 0,
                                                width: `${Math.min((product.count || 0) * 10, 100)}%`,
                                                backgroundColor: (product.count || 0) < 10 ? '#ef4444' : '#10b981',
                                                borderRadius: '3px'
                                            }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => navigate(`/edit-product/${product.id}`)}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#f3f4f6',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                color: '#374151',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                                            title="Edit Product"
                                        >
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#fee2e2',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                color: '#dc2626',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fecaca'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                                            title="Delete Product"
                                        >
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Your inventory is empty.</p>
                        <Link to="/add-product" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Add your first product</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
