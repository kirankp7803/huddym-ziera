import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                {/* Indian Wedding/Festive Image */}
                <img src="https://images.unsplash.com/photo-1595085610896-fb31cfd5d4b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" alt="Indian Bridal Fashion" className="hero-bg" />
                <div className="hero-overlay"></div>

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
            <section style={{ marginBottom: '4rem' }}>
                <h2 className="section-title">Ethnic Elegance</h2>
                <div className="grid-3">
                    {[
                        { title: "Silk Sarees", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Festive Lehengas", img: "https://images.unsplash.com/photo-1585854460557-4b726ae58917?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Churidar", img: "https://images.unsplash.com/photo-1631248055158-b4604e0e0589?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { title: "Designer Kurtis", img: "https://images.unsplash.com/photo-1583391733958-e026b1346375?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80" }
                    ].map((cat, idx) => (
                        <div key={idx} className="category-card">
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
            <section style={{ marginBottom: '4rem' }}>
                <h2 className="section-title">Latest Arrivals</h2>
                <div className="grid-3">
                    {[
                        { name: "Royal Blue Silk Saree", price: 12999, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { name: "Embroidered Maroon Lehenga", price: 15499, img: "https://images.unsplash.com/photo-1585854460557-4b726ae58917?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" },
                        { name: "Gold Plated Jewellery", price: 4999, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" }
                    ].map((item, idx) => (
                        <div key={idx} className="product-card">
                            <img src={item.img} alt={item.name} className="product-img" />
                            <div className="product-info">
                                <h3 className="product-name">{item.name}</h3>
                                <p className="product-price">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/shop" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}>View All Products</Link>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <h2 className="newsletter-title">Join Our Community</h2>
                <p className="newsletter-text">Subscribe to our newsletter for exclusive offers, early access to new collections, and style tips.</p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                    <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
            </section>
        </div>
    );
};

export default Home;
