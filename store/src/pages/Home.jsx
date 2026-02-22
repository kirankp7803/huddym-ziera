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
            <section className="hero-section" style={{
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1583391733958-e026b1346375?w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'none',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1.5rem',
                marginBottom: '4rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="hero-content" style={{ textAlign: 'center', color: 'white' }}>
                    <h1 className="hero-title" style={{ color: 'white' }}>
                        Timeless <span className="highlight">Tradition</span>
                    </h1>
                    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
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
                        {
                            title: "Saree",
                            img: "https://images.unsplash.com/photo-1621114638515-2f462bb57448?w=800&q=80",
                            video: "https://v.ftcdn.net/04/91/92/51/240_F_491925102_pAtC7X4fK8XkEq7O4fK8XkEq7O4fK8.mp4"
                        },
                        {
                            title: "Lehenga",
                            img: "https://images.unsplash.com/photo-1599451100913-75b9ca868137?w=800&q=80",
                            video: "https://v.ftcdn.net/05/11/47/35/240_F_511473523_XlXyUfXvXpXvXpXvXpXvXpXvXp.mp4"
                        },
                        {
                            title: "Kurti",
                            img: "https://images.unsplash.com/photo-1583391733958-e026b1346375?w=800&q=80",
                            video: "https://v.ftcdn.net/05/56/74/42/240_F_556744219_XlXyUfXvXpXvXpXvXpXvXpXvXp.mp4"
                        },
                        {
                            title: "Churidar",
                            img: "https://images.unsplash.com/photo-1631248055158-b4604e0e0589?w=800&q=80",
                            video: "https://v.ftcdn.net/05/21/54/12/240_F_521541234_XlXyUfXvXpXvXpXvXpXvXpXvXp.mp4"
                        },
                        { title: "Jewelry", img: "https://images.unsplash.com/photo-1515562141122-7a429b8208cb?w=800&q=80" },
                        { title: "T-Shirt", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
                        { title: "Pants", img: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=80" },
                        { title: "Footwear", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80" },
                        { title: "Accessories", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" }
                    ].map((cat, idx) => (
                        <div key={idx} className="category-card" onClick={() => handleCategoryClick(cat.title)}>
                            {cat.video ? (
                                <video
                                    src={cat.video}
                                    className="category-img"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster={cat.img}
                                />
                            ) : (
                                <img src={cat.img} alt={cat.title} className="category-img" />
                            )}
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
                        { name: "Royal Gold Silk Saree", price: 12999, img: "https://images.unsplash.com/photo-1621114638515-2f462bb57448?w=800&q=80" },
                        { name: "Handcrafted Bridal Lehenga", price: 25499, img: "https://images.unsplash.com/photo-1599451100913-75b9ca868137?w=800&q=80" },
                        { name: "Floral Embroidered Kurti", price: 4999, img: "https://images.unsplash.com/photo-1583391733958-e026b1346375?w=800&q=80" }
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
