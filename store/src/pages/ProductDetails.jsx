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
    const [error, setError] = useState(null);

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
                setError("Could not load product details.");
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
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>;
    if (!product) return <div style={{ textAlign: 'center', padding: '2rem' }}>Product not found</div>;

    return (
        <div className="product-details-container">
            <button
                onClick={() => window.history.back()}
                className="back-btn"
            >
                <ArrowLeft size={20} /> Back
            </button>
            <div className="product-details-layout">
                <div className="product-image-section">
                    <img src={product.image} alt={product.name} className="product-main-img" />
                </div>
                <div className="product-detail-info">
                    <h1 className="product-title-large">{product.name}</h1>
                    <p className="product-price-hero">₹{product.price}</p>
                    <p className="product-desc-text">{product.description}</p>

                    <div className="product-actions-group">
                        <button onClick={() => addToCart(product)} className="btn-buy-now">Add to Bag</button>
                        <button
                            onClick={buyNow}
                            className="btn-buy-now"
                            style={{ backgroundColor: '#1d4ed8' }}
                        >Buy Now</button>
                        <button
                            onClick={toggleWishlist}
                            className={`btn-wishlist-large ${isWishlisted ? 'active' : ''}`}
                        >
                            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                        </button>
                    </div>

                    <div className="trust-badges-grid">
                        <div className="trust-badge-item">
                            <div className="badge-icon">🔒</div>
                            <span className="badge-text">Secure Payment</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="badge-icon">🚚</div>
                            <span className="badge-text">Free Shipping</span>
                        </div>
                        <div className="trust-badge-item">
                            <div className="badge-icon">↩️</div>
                            <span className="badge-text">Easy Returns</span>
                        </div>
                    </div>

                    {complimentaryProducts.length > 0 && (
                        <div className="complimentary-section">
                            <h2 className="section-subtitle">Complete the Look</h2>
                            <div className="complimentary-grid">
                                {complimentaryProducts.map(item => (
                                    <div key={item.id} className="complimentary-card">
                                        <img src={item.image} alt={item.name} className="comp-img" />
                                        <h3 className="comp-name">{item.name}</h3>
                                        <p className="comp-price">₹{item.price}</p>
                                        <div className="comp-actions">
                                            <Link to={`/product/${item.id}`} className="btn-view-comp">
                                                View
                                            </Link>
                                            <button
                                                onClick={() => addToCart(item, true)}
                                                className="btn-add-comp"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
                <div className="reviews-header">
                    <h2 className="section-subtitle">Customer Reviews</h2>
                    <button
                        onClick={() => navigate('/write-review', { state: { productName: product.name } })}
                        className="btn-write-review"
                    >
                        Write a Review
                    </button>
                </div>
                <div className="reviews-list">
                    {[
                        { name: "Priya Sharma", rating: "★★★★★", text: "Absolutely beautiful! The quality is amazing and it fits perfectly." },
                        { name: "Anjali Gupta", rating: "★★★★☆", text: "Great fabric and design. Deliver was also very fast. Highly recommend." },
                        { name: "Sneha Patel", rating: "★★★★★", text: "Stunning piece. Wore it to a wedding and got so many compliments!" }
                    ].map((review, idx) => (
                        <div key={idx} className="review-item">
                            <div className="review-meta">
                                <span className="review-author">{review.name}</span>
                                <span className="review-rating">{review.rating}</span>
                            </div>
                            <p className="review-text">{review.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
