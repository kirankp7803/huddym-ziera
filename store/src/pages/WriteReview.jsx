
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

const WriteReview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productName = location.state?.productName || 'Product';

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        review: ''
    });

    const handleStarClick = (star) => {
        setRating(star);
    };

    const handleMouseEnter = (star) => {
        setHoverRating(star);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log({ ...formData, rating });
        alert('Thank you for your review! It has been submitted for approval.');
        navigate(-1); // Go back to the previous page
    };

    return (
        <div style={{ padding: '2rem 5%', backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '2rem',
                        color: '#4b5563',
                        fontSize: '1rem'
                    }}
                >
                    <ArrowLeft size={20} /> Back to Product
                </button>

                <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1e3a8a' }}>Write a Review</h1>
                    <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem' }}>Sharing your thoughts on <span style={{ fontWeight: 'bold', color: '#ea580c' }}>{productName}</span></p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Rating Section */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>Overall Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => handleMouseEnter(star)}
                                        onMouseLeave={handleMouseLeave}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        <Star
                                            size={32}
                                            fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                                            color={(hoverRating || rating) >= star ? '#fbbf24' : '#d1d5db'}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating === 0 && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>Please select a rating</p>}
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your public name"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem' }}
                            />
                        </div>

                        {/* Review Title */}
                        <div>
                            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>Review Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Sum up your experience in a short headline"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem' }}
                            />
                        </div>

                        {/* Review Body */}
                        <div>
                            <label htmlFor="review" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>Your Review</label>
                            <textarea
                                id="review"
                                name="review"
                                value={formData.review}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Tell us what you liked or disliked about this product."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                            ></textarea>
                        </div>



                        <button
                            type="submit"
                            className="btn-primary"
                            style={{
                                padding: '1rem',
                                fontSize: '1.1rem',
                                marginTop: '1rem',
                                opacity: rating === 0 ? 0.7 : 1,
                                cursor: rating === 0 ? 'not-allowed' : 'pointer'
                            }}
                            disabled={rating === 0}
                        >
                            Submit Review
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default WriteReview;
