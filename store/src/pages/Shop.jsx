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

    // Handle horizontal scrolling of active category on mobile
    useEffect(() => {
        const activeBtn = document.getElementById('active-category');
        if (activeBtn && window.innerWidth <= 768) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        // Also scroll to top of product list when category changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedCategory]);

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
                    <ul className="category-list" id="mobile-category-list">
                        {categories.map(category => (
                            <li key={category}>
                                <button
                                    id={category === selectedCategory ? 'active-category' : ''}
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

                    {/* Unified Premium Grid (Mobile & Desktop) */}
                    <div className="compact-product-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="compact-grid-card" onClick={() => navigate(`/product/${product.id}`)}>
                                <div className="compact-grid-img-wrap">
                                    <img src={product.image} alt={product.name} className="compact-grid-img" />
                                    <span className="badge-sale">Sale</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                        className="compact-grid-wishlist-btn"
                                    >
                                        <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <div className="compact-grid-info">
                                    <h3 className="compact-grid-name">{product.name}</h3>
                                    <div className="compact-grid-bottom">
                                        <span className="compact-grid-price">₹{product.price}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            className="compact-grid-add-btn"
                                        >
                                            +Bag
                                        </button>
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
