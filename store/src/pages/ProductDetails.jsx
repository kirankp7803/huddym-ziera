import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [complimentaryProducts, setComplimentaryProducts] = useState([]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                const found = response.data.find(p => p.id === parseInt(id) || p.id === id);
                setProduct(found);

                // Check if in wishlist
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                if (found && wishlist.some(item => item.id === found.id)) {
                    setIsWishlisted(true);
                }

                // Find complimentary products
                if (found) {
                    const colors = ['red', 'crimson', 'maroon', 'blue', 'green', 'gold', 'silver', 'pink', 'yellow', 'black', 'white', 'orange', 'purple', 'beige', 'cream', 'navy', 'teal'];
                    const productText = (found.name + " " + found.description).toLowerCase();
                    const foundColors = colors.filter(color => productText.includes(color));

                    const compliments = response.data.filter(p => {
                        if (p.id === found.id) return false;
                        const isAccessory = ['Jewelry', 'Footwear', 'Accessories'].includes(p.category);
                        if (!isAccessory) return false;

                        // If no colors found in main product, return random accessories
                        if (foundColors.length === 0) return true;

                        // Check for color match
                        const pText = (p.name + " " + p.description).toLowerCase();
                        const isColorMatch = foundColors.some(color => pText.includes(color));
                        if (!isColorMatch) return false;

                        // Price Check: Complimentary product shouldn't be wildly more expensive than the main product
                        // Allow some buffer (e.g. +500) for cheap items
                        const mainPrice = parseInt(found.price);
                        const compPrice = parseInt(p.price);
                        if (compPrice > (mainPrice * 1.5) + 500) return false;

                        return true;
                    }).slice(0, 4); // Limit to 4 items

                    setComplimentaryProducts(compliments);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const navigate = useNavigate();

    const addToCart = (item, silent = false) => {
        // Basic cart implementation using localStorage for now
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemToAdd = item || product;
        cart.push(itemToAdd);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        if (!silent) alert('Added to cart!');
    };

    const buyNow = () => {
        addToCart(product, true);
        navigate('/cart');
    };

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let updatedWishlist;

        if (isWishlisted) {
            updatedWishlist = wishlist.filter(item => item.id !== product.id);
            setIsWishlisted(false);
        } else {
            updatedWishlist = [...wishlist, product];
            setIsWishlisted(true);
        }
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!product) return <div>Product not found</div>;

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
            <div className="product-details-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                <div style={{ flex: 1 }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '1rem', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '1.5rem' }}>₹{product.price}</p>
                    <p style={{ marginBottom: '2rem', color: '#4b5563' }}>{product.description}</p>

                    {complimentaryProducts.length > 0 && (
                        <div style={{ marginTop: '3rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Complimentary Products</h2>
                            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                {complimentaryProducts.map(item => (
                                    <div key={item.id} style={{ flexShrink: 0, width: '180px', border: '1px solid #eee', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.75rem' }} />
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                        <p className="product-price" style={{ fontSize: '1rem' }}>₹{item.price}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <a href={`/product/${item.id}`} className="btn-primary" style={{ flex: 1, fontSize: '0.9rem', padding: '0.5rem', textAlign: 'center', textDecoration: 'none' }}>
                                                View
                                            </a>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="btn-primary"
                                                style={{ flex: 1, fontSize: '0.9rem', padding: '0.5rem', background: 'var(--color-secondary)' }}
                                            >
                                                Add to Bag
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={() => addToCart(product)} className="btn-primary" style={{ flex: 1, minWidth: '150px' }}>Add to Bag</button>
                        <button
                            onClick={buyNow}
                            style={{
                                flex: 1,
                                minWidth: '150px',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '9999px',
                                backgroundColor: '#1d4ed8',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >Buy Now</button>
                        <button
                            onClick={toggleWishlist}
                            style={{
                                border: '1px solid #ccc',
                                background: isWishlisted ? '#fee2e2' : 'white',
                                color: isWishlisted ? '#b91c1c' : '#374151',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Secure Payment</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚚</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Free Shipping</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>↩️</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Easy Returns</span>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div style={{ marginTop: '4rem', padding: '2rem', background: '#fff7ed', borderRadius: '1rem', gridColumn: '1 / -1', width: '100%' }}>
                    <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2rem' }}>Customer Reviews</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ borderBottom: '1px solid #fed7aa', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Priya Sharma</span>
                                <span style={{ color: '#f59e0b' }}>★★★★★</span>
                            </div>
                            <p style={{ color: '#52525b' }}>Absolutely beautiful! The quality is amazing and it fits perfectly.</p>
                        </div>
                        <div style={{ borderBottom: '1px solid #fed7aa', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Anjali Gupta</span>
                                <span style={{ color: '#f59e0b' }}>★★★★☆</span>
                            </div>
                            <p style={{ color: '#52525b' }}>Great fabric and design. Deliver was also very fast. Highly recommend.</p>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Sneha Patel</span>
                                <span style={{ color: '#f59e0b' }}>★★★★★</span>
                            </div>
                            <p style={{ color: '#52525b' }}>Stunning piece. Wore it to a wedding and got so many compliments!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
