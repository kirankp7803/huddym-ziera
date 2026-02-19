import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);

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
        <div style={{ padding: '4rem 5%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        color: '#4b5563',
                        fontSize: '1rem'
                    }}
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 style={{ fontSize: '2.5rem', fontFamily: 'serif', marginBottom: '3rem' }}>Shopping Bag ({cart.length})</h1>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.map((item, index) => (
                            <div key={index} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', display: 'flex', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', flexDirection: window.innerWidth < 480 ? 'column' : 'row' }}>
                                <img src={item.image} alt={item.name} style={{ width: window.innerWidth < 480 ? '100%' : '100px', height: window.innerWidth < 480 ? '200px' : '100px', objectFit: 'cover', borderRadius: '0.75rem' }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{item.name}</h3>
                                            <p style={{ fontWeight: 'bold' }}>₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                                        </div>
                                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>{item.category}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Bag Summary</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#10b981' }}>FREE</span>
                            </div>
                            <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '800' }}>
                                <span>Total</span>
                                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            style={{
                                width: '100%',
                                marginTop: '2rem',
                                padding: '1.25rem',
                                backgroundColor: '#111827',
                                color: 'white',
                                border: 'none',
                                borderRadius: '1rem',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
