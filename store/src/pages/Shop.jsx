import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingBag, Eye, Zap, Heart } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Could not load products. Please check if the server is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');

    // Update selected category if location state changes (e.g. navigation from Home)
    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
    }, [location.state]);

    const categories = ['All', 'Saree', 'Churidar', 'T-Shirt', 'Pants', 'Kurti', 'Lehenga', 'Jewelry', 'Footwear', 'Accessories'];
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(savedWishlist);
    }, []);

    const toggleWishlist = (product) => {
        let updatedWishlist;
        if (wishlist.some(item => item.id === product.id)) {
            updatedWishlist = wishlist.filter(item => item.id !== product.id);
        } else {
            updatedWishlist = [...wishlist, product];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const navigate = useNavigate();

    const addToCart = (product, silent = false) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        if (!silent) alert(`${product.name} added to bag!`);
    };

    const buyNow = (product) => {
        addToCart(product, true);
        navigate('/cart');
    };

    const isInWishlist = (id) => wishlist.some(item => item.id === id);

    if (loading) return <div className="loading">Loading beautiful items...</div>;
    if (error) return <div className="error-message" style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>;

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="shop-container">
            <button
                onClick={() => window.history.back()}
                className="back-btn"
            >
                <ArrowLeft size={20} /> Back
            </button>
            <div className="shop-layout">
                {/* Category Sidebar */}
                <aside className="shop-sidebar">
                    <h3 className="sidebar-title">Categories</h3>
                    <ul className="category-list">
                        {categories.map(category => (
                            <li key={category}>
                                <button
                                    onClick={() => setSelectedCategory(category)}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Product List */}
                <div className="product-list-container">
                    <div className="sale-banner">
                        <div className="sale-content">
                            <h2 className="sale-title">Festive Sale is Live!</h2>
                            <p className="sale-text">Get flat <span className="highlight-bold">20% OFF</span> on all Silk Sarees. Use code: <span className="promo-code">FESTIVE20</span></p>
                        </div>
                        <div className="sale-emoji">🎉</div>
                    </div>
                    <h2 className="section-title shop-section-title">{selectedCategory === 'All' ? 'All Products' : selectedCategory}</h2>

                    {/* Mobile product list (single column, horizontal cards) */}
                    <div className="mobile-product-list">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="mobile-product-card" onClick={() => navigate(`/product/${product.id}`)}>
                                <div className="mobile-product-img-wrap">
                                    <img src={product.image} alt={product.name} className="mobile-product-img" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                        className="mobile-wishlist-btn"
                                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <div className="mobile-product-info">
                                    <span className="mobile-badge">{product.category}</span>
                                    <h3 className="mobile-product-name">{product.name}</h3>
                                    <p className="mobile-product-desc">{product.description?.slice(0, 50)}...</p>
                                    <div className="mobile-product-bottom">
                                        <span className="mobile-product-price">₹{product.price}</span>
                                        <div className="mobile-product-actions">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                className="mobile-btn-cart"
                                                title="Add to Bag"
                                            >
                                                <ShoppingBag size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); buyNow(product); }}
                                                className="mobile-btn-buy"
                                            >
                                                Buy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop product grid */}
                    <div className="product-list-grid desktop-product-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-card-image-wrap" onClick={() => navigate(`/product/${product.id}`)}>
                                    <img src={product.image} alt={product.name} className="product-img" />
                                    <span className="badge-category">{product.category}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                        className="wishlist-btn-overlay"
                                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                    </button>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-description-short">{product.description?.slice(0, 60)}...</p>
                                    <div className="product-card-footer">
                                        <span className="product-price">₹{product.price}</span>
                                        <div className="product-card-actions-grid">
                                            <button
                                                onClick={() => navigate(`/product/${product.id}`)}
                                                className="btn-details-shop"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="btn-add-cart"
                                            >
                                                Add to Bag
                                            </button>
                                            <button
                                                onClick={() => buyNow(product)}
                                                className="btn-buy-now"
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
