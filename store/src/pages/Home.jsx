import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

const Home = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState({ type: '', message: '' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            setSubscriptionStatus({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/subscribe`, { email });
            setSubscriptionStatus({ type: 'success', message: response.data.message });
            setEmail('');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
            setSubscriptionStatus({ type: 'error', message: errorMsg });
        }
    };

    const handleCategoryClick = (category) => {
        navigate('/shop', { state: { category } });
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section" style={{ background: 'transparent', boxShadow: 'none' }}>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Timeless <span className="highlight">Tradition</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore our exquisite collection of Sarees, Lehengas, and Kurtis. Handcrafted for the modern Indian woman.
                    </p>
                    <Link to="/shop" className="btn-primary">
                        Explore Collection
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="home-section">
                <h2 className="section-title">Categories</h2>
                <div className="grid-3">
                    {[
                        { title: "Saree", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Churidar", img: "https://images.unsplash.com/photo-1631248055158-b4604e0e0589?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "T-Shirt", img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Pants", img: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Kurti", img: "https://images.unsplash.com/photo-1583391733958-e026b1346375?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80" },
                        { title: "Lehenga", img: "https://images.unsplash.com/photo-1585854460557-4b726ae58917?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Jewelry", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Footwear", img: "https://images.unsplash.com/photo-1560769623-4674eb2d3960?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" },
                        { title: "Accessories", img: "https://images.unsplash.com/photo-1609357606029-28f58582d023?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" }
                    ].map((cat, idx) => (
                        <div key={idx} className="category-card" onClick={() => handleCategoryClick(cat.title)}>
                            <img src={cat.img} alt={cat.title} className="category-img" />
                            <div className="category-overlay">
                                <h3 className="category-title">{cat.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="features-section">
                <div className="feature-card">
                    <span className="feature-icon">✨</span>
                    <h3 className="feature-title">Authentic Designs</h3>
                    <p>Handpicked traditional wear directly from artisans across India.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🚀</span>
                    <h3 className="feature-title">Fast Shipping</h3>
                    <p>Express delivery to your doorstep within 3-5 business days.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🛡️</span>
                    <h3 className="feature-title">Secure Payment</h3>
                    <p>100% secure payment gateway with Razorpay integration.</p>
                </div>
            </section>

            {/* Latest Arrivals Preview */}
            <section className="home-section">
                <h2 className="section-title">Latest Arrivals</h2>
                <div className="grid-3">
                    {[
                        { name: "Royal Blue Silk Saree", price: 12999, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { name: "Embroidered Maroon Lehenga", price: 15499, img: "https://images.unsplash.com/photo-1585854460557-4b726ae58917?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { name: "Gold Plated Jewellery", price: 4999, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" }
                    ].map((item, idx) => (
                        <div key={idx} className="product-card arrival-card">
                            <span className="badge-new">New</span>
                            <img src={item.img} alt={item.name} className="product-img" />
                            <div className="product-info">
                                <h3 className="product-name">{item.name}</h3>
                                <p className="product-price">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="view-all-container">
                    <Link to="/shop" className="btn-primary btn-outline">View All Products</Link>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <h2 className="section-title">Happy Customers</h2>
                <div className="home-testimonials-grid">
                    {[
                        { name: "Priya Sharma", text: "The saree I ordered was exactly as shown. The silk quality is premium and the color is so vibrant! Truly authentic.", location: "Mumbai" },
                        { name: "Anjali Gupta", text: "Fast delivery and excellent packaging. The lehenga fit perfectly. Will definitely shop again for my sister's wedding.", location: "Delhi" },
                        { name: "Sneha Reddy", text: "I love the collection of Kurtis. Very comfortable fabric and unique designs that I can't find in local stores.", location: "Hyderabad" }
                    ].map((review, idx) => (
                        <div key={idx} className="testimonial-card">
                            <div className="testimonial-avatar">
                                {review.name.charAt(0)}
                            </div>
                            <p className="testimonial-text">"{review.text}"</p>
                            <h4 className="testimonial-name">{review.name}</h4>
                            <span className="testimonial-location">{review.location}</span>
                            <div className="testimonial-stars">★★★★★</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <h2 className="newsletter-title">Join Our Community</h2>
                <p className="newsletter-text">Subscribe to our newsletter for exclusive offers, early access to new collections, and style tips.</p>
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="newsletter-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
                {subscriptionStatus.message && (
                    <p style={{
                        marginTop: '1rem',
                        color: subscriptionStatus.type === 'success' ? '#10b981' : '#ef4444',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {subscriptionStatus.message}
                    </p>
                )}
            </section>
        </div>
    );
};

export default Home;
