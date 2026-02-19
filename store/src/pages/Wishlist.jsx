import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(savedWishlist);
    }, []);

    const removeFromWishlist = (id) => {
        const updatedWishlist = wishlist.filter(item => item.id !== id);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    };

    return (
        <div style={{ marginTop: '2rem' }}>
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
                ← Back
            </button>
            <div>
                <h2 className="section-title">My Wishlist</h2>
                {wishlist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your wishlist is empty.</p>
                        <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="grid-3">
                        {wishlist.map((product) => (
                            <div key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} className="product-img" />
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">₹{product.price}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="btn-primary"
                                            style={{ flex: 1, fontSize: '0.9rem', padding: '0.5rem' }}
                                        >
                                            Add to Bag
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            style={{
                                                background: '#fee2e2',
                                                color: '#b91c1c',
                                                border: 'none',
                                                padding: '0.5rem',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
