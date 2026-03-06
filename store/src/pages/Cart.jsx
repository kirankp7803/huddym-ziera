import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

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

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #1f1c2c 0%, #09090b 100%)',
            color: '#fafafa',
            padding: '2rem 1rem',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Ambient Background Glowing Orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(239, 68, 68, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '500px', height: '500px', background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0 }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', cursor: 'pointer', width: 'max-content', opacity: 0.8, transition: '0.3s' }} onClick={() => window.history.back()} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                    <ArrowLeft size={24} style={{ marginRight: '0.75rem', color: '#fbbf24' }} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Continue Shopping</span>
                </div>

                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '3.5rem', fontWeight: 700, marginBottom: '2.5rem', background: 'linear-gradient(to right, #fbbf24, #fca5a5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Your Bag <span style={{ fontSize: '2rem', marginLeft: '1rem', color: '#71717a', WebkitTextFillColor: '#71717a' }}>({cart.length}) {cart.length === 1 ? 'item' : 'items'}</span>
                </h1>

                {cart.length === 0 ? (
                    <div style={{
                        padding: '6rem 2rem',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{ fontSize: '6rem', marginBottom: '2rem', transform: 'rotate(-10deg)', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>🛍️</div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: '"Playfair Display", serif' }}>It's lonely here...</h2>
                        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '3rem' }}>Discover our premium collection and treat yourself today.</p>
                        <Link to="/shop" style={{
                            padding: '1rem 3rem',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            letterSpacing: '1px',
                            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                            transition: 'all 0.3s ease',
                            display: 'inline-block'
                        }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                        >Explore Collection</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', minHeight: '50vh', '@media (min-width: 992px)': { gridTemplateColumns: '2fr 1fr' } }} className="cart-grid-override">
                        {/* CSS Inject for grid override */}
                        <style>{`
                            @media (min-width: 992px) { .cart-grid-override { grid-template-columns: 1.8fr 1.1fr !important; } }
                            .cart-item-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                            .cart-item-card:hover { transform: translateX(8px); background: rgba(255,255,255, 0.04) !important; border-color: rgba(251, 191, 36, 0.3) !important; }
                        `}</style>

                        {/* Items Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {cart.map((item, index) => (
                                <div key={index} className="cart-item-card" style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '1.5rem',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    alignItems: 'center'
                                }}>

                                    <div style={{ width: '120px', height: '140px', borderRadius: '1rem', overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#f3f4f6', marginBottom: '0.25rem', paddingRight: '1rem' }}>{item.name}</h3>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24', whiteSpace: 'nowrap' }}>₹{parseFloat(item.price).toLocaleString('en-IN')}</span>
                                            </div>
                                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', opacity: 0.7, fontSize: '0.85rem' }}>
                                                <ShieldCheck size={16} style={{ marginRight: '0.4rem', color: '#10b981' }} /> In Stock & Ready to Ship
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    padding: '0.5rem',
                                                    borderRadius: '0.5rem',
                                                    transition: '0.2s',
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
                            <div style={{
                                background: 'linear-gradient(145deg, rgba(24, 24, 27, 0.8), rgba(9, 9, 11, 0.95))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '2rem',
                                padding: '2.5rem',
                                border: '1px solid rgba(251, 191, 36, 0.2)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                            }}>
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Order Summary</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '1.1rem' }}>
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span style={{ fontWeight: 500, color: 'white' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '1.1rem' }}>
                                        <span>Estimated Shipping</span>
                                        <span style={{ color: '#10b981', fontWeight: 600, letterSpacing: '0.5px' }}>COMPLIMENTARY</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '1.1rem' }}>
                                        <span>Taxes</span>
                                        <span style={{ fontWeight: 500, color: 'white' }}>Calculated at checkout</span>
                                    </div>
                                </div>

                                <div style={{
                                    borderTop: '1px dashed rgba(255,255,255,0.2)',
                                    paddingTop: '1.5rem',
                                    marginBottom: '2.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end'
                                }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 600 }}>Total</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '1rem',
                                        fontSize: '1.15rem',
                                        fontWeight: 700,
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'none'}
                                >
                                    Proceed to Checkout <ChevronRight size={20} />
                                </button>

                                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', color: '#a1a1aa' }}>
                                        <CreditCard size={24} />
                                        <ShieldCheck size={24} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: '#71717a', textAlign: 'center' }}>
                                        Guaranteed safe and secure checkout<br />powered by 256-bit SSL encryption.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
