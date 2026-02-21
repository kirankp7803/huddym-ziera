import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Cart = () => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleCartUpdate = () => {
            setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const removeFromCart = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

    if (cart.length === 0) {
        return (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f9fafb', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛍️</div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'serif' }}>Your Bag is Empty</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Looks like you haven't added anything to your bag yet.</p>
                <Link to="/shop" style={{ padding: '1rem 2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '9999px', textDecoration: 'none', fontWeight: 'bold' }}>Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <div className="cart-content-wrapper">
                <button
                    onClick={() => window.history.back()}
                    className="back-btn"
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 className="cart-title">Shopping Bag ({cart.length})</h1>

                <div className="cart-layout">
                    {/* Items List */}
                    <div className="cart-items-list">
                        {cart.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <div>
                                        <div className="cart-item-header">
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-price">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                                        </div>
                                        <p className="cart-item-category">{item.category}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="btn-remove"
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div className="cart-summary-card">
                        <h2 className="summary-title">Bag Summary</h2>
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary btn-checkout"
                            style={{ backgroundColor: '#111827' }}
                        >
                            Proceed to Checkout
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>

                        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span>🔒</span> SSL Encrypted Payment
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/shop" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>← Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
