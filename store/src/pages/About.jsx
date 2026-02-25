
import { ArrowLeft } from 'lucide-react';

const About = () => {
    return (
        <div className="about-page-container" style={{ padding: '2rem 1.25rem', minHeight: '80vh', backgroundColor: '#fdfbf7' }}>
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
                <ArrowLeft size={20} /> Back
            </button>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', textAlign: 'center', marginBottom: '1rem', color: '#1e3a8a' }}>About Huddym Zeira</h1>
                <p style={{ textAlign: 'center', fontSize: '1.25rem', color: '#6b7280', marginBottom: '4rem' }}>
                    Redefining elegance with a touch of tradition.
                </p>

                <div className="about-grid-2">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                            alt="Our Story"
                            style={{ width: '100%', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                        />
                    </div>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: '#1e3a8a' }}>Our Story</h2>
                        <p style={{ lineHeight: '1.8', color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            Founded with a passion for celebrating the rich heritage of Indian textiles, Huddym Zeira began as a small curated collection of handpicked sarees. We believed that traditional wear shouldn't just be for special occasions but a part of everyday elegance.
                        </p>
                        <p style={{ lineHeight: '1.8', color: '#4b5563', fontSize: '1.1rem' }}>
                            Over the years, we've grown into a beloved destination for women seeking authentic, high-quality ethnic wear. From the looms of Banaras to the block printers of Jaipur, we bring you stories woven in thread, directly to your doorstep.
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: '#1e3a8a' }}>Why Shop With Us?</h2>
                    <div className="about-features-grid">
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧵</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Authentic Craftsmanship</h3>
                            <p style={{ color: '#6b7280' }}>We work directly with artisans to ensure every piece is genuine and supports traditional crafts.</p>
                        </div>
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Premium Quality</h3>
                            <p style={{ color: '#6b7280' }}>Every fabric is quality checked. If we wouldn't wear it, we won't sell it.</p>
                        </div>
                        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Hassle-Free Experience</h3>
                            <p style={{ color: '#6b7280' }}>Fast shipping, easy returns, and secure payments make your shopping worry-free.</p>
                        </div>
                    </div>
                </div>

                <div className="about-grid-reverse">
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: '#1e3a8a' }}>Embrace Your Style</h2>
                        <p style={{ lineHeight: '1.8', color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            Fashion is more than just clothing; it's an expression of who you are. Whether you're looking for a breezy Kurti for work, a regal Lehenga for a wedding, or comfortable Palazzos for a weekend outing, we have something to suit every mood and moment.
                        </p>
                        <p style={{ lineHeight: '1.8', color: '#4b5563', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Join our community of thousands of stylish women who trust Huddym Zeira for their fashion needs. Experience the joy of wearing clothes that are made with love and care.
                        </p>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                            alt="Fashion Shopping"
                            style={{ width: '100%', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
