import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
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
                    <div className="product-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card-horizontal">
                                <div className="product-card-horizontal-img">
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="product-card-horizontal-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#27272a' }}>{product.name}</h3>
                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: isInWishlist(product.id) ? '#ef4444' : '#d1d5db',
                                                transition: 'transform 0.2s'
                                            }}
                                            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                        </button>
                                    </div>
                                    <p style={{ color: '#52525b', marginBottom: '1rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</p>
                                    <div className="product-card-footer">
                                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{product.price}</span>
                                        <div className="product-card-actions">
                                            <Link to={`/product/${product.id}`} className="btn-details">
                                                Details
                                            </Link>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="btn-primary"
                                                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: 'var(--color-secondary)' }}
                                            >
                                                Add to Bag
                                            </button>
                                            <button
                                                onClick={() => buyNow(product)}
                                                className="btn-primary"
                                                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#1d4ed8' }}
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
