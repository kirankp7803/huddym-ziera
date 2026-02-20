import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [complimentaryProducts, setComplimentaryProducts] = useState([]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
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
                className="back-btn"
            >
                <ArrowLeft size={20} /> Back
            </button>
            <div className="product-details-layout">
                <div style={{ flex: 1 }}>
                    <img src={product.image} alt={product.name} className="product-main-img" />
                </div>
                <div className="product-detail-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price-large">₹{product.price}</p>
                    <p className="product-description">{product.description}</p>

                    {complimentaryProducts.length > 0 && (
                        <div className="complimentary-section">
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Complimentary Products</h2>
                            <div className="complimentary-grid">
                                {complimentaryProducts.map(item => (
                                    <div key={item.id} className="complimentary-card">
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.75rem' }} />
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                        <p className="product-price" style={{ fontSize: '1rem' }}>₹{item.price}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <Link to={`/product/${item.id}`} className="btn-primary" style={{ flex: 1, fontSize: '0.9rem', padding: '0.5rem', textAlign: 'center', textDecoration: 'none' }}>
                                                View
                                            </Link>
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

                    <div className="product-actions-group">
                        <button onClick={() => addToCart(product)} className="btn-primary" style={{ flex: 1, minWidth: '150px' }}>Add to Bag</button>
                        <button
                            onClick={buyNow}
                            className="btn-primary"
                            style={{
                                flex: 1,
                                minWidth: '150px',
                                backgroundColor: '#1d4ed8'
                            }}
                        >Buy Now</button>
                        <button
                            onClick={toggleWishlist}
                            className="btn-primary"
                            style={{
                                flex: 1,
                                minWidth: '150px',
                                background: isWishlisted ? '#fee2e2' : 'white',
                                color: isWishlisted ? '#b91c1c' : '#374151',
                                border: '1px solid #ccc'
                            }}
                        >
                            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                        </button>
                    </div>

                    <div className="trust-badges-grid">
                        <div className="trust-badge-item">
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Secure Payment</span>
                        </div>
                        <div className="trust-badge-item">
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚚</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Free Shipping</span>
                        </div>
                        <div className="trust-badge-item">
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>↩️</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Easy Returns</span>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: 0 }}>Customer Reviews</h2>
                        <button
                            onClick={() => navigate('/write-review', { state: { productName: product.name } })}
                            className="btn-primary"
                        >
                            Write a Review
                        </button>
                    </div>
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
