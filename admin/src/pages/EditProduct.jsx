import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const MAX_IMAGES = 5;

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        count: '',
        category: 'Saree',
        description: '',
        image: '',       // primary image (first slot)
        images: ['', '', '', '', ''],  // all 5 image slots (index 0 = primary)
        videoUrl: '',    // optional product video URL
    });
    const [loading, setLoading] = useState(true);

    const categories = ['Saree', 'Churidar', 'T-Shirt', 'Pants', 'Kurti', 'Lehenga', 'Jewelry', 'Footwear', 'Accessories'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                const product = response.data.find(p => p.id === parseInt(id));
                if (product) {
                    // Normalize the loaded images array to exactly 5 slots
                    let loadedImages = product.images || [];
                    if (loadedImages.length === 0 && product.image) {
                        loadedImages = [product.image];
                    }
                    const filledImages = [...loadedImages, '', '', '', '', ''].slice(0, 5);

                    setFormData({
                        ...product,
                        images: filledImages,
                        videoUrl: product.videoUrl || ''
                    });
                } else {
                    alert("Product not found");
                    navigate('/inventory');
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Update a specific image slot URL
    const handleImageUrl = (idx, value) => {
        const imgs = [...formData.images];
        imgs[idx] = value;
        setFormData({
            ...formData,
            images: imgs,
            image: imgs[0] || '',   // keep primary image in sync with slot 0
        });
    };

    // Handle file upload for a specific slot
    const handleFileChange = (idx, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            handleImageUrl(idx, reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle file upload for video
    const handleVideoFileChange = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, videoUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const filledImages = formData.images.filter(Boolean);
        const payload = {
            ...formData,
            image: filledImages[0] || '',          // first filled image = primary
            images: filledImages,                   // all filled images
        };
        try {
            await axios.put(`${API_BASE_URL}/products/${id}`, payload);
            alert('Product updated successfully!');
            navigate('/inventory');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product.');
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.85rem', borderRadius: '0.65rem',
        border: '1px solid #e5e7eb', fontSize: '0.95rem', boxSizing: 'border-box',
    };
    const labelStyle = {
        display: 'block', marginBottom: '0.5rem',
        fontWeight: '600', color: '#4b5563', fontSize: '0.9rem',
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Product Details...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/inventory')}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                ← Back to Inventory
            </button>

            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.07)', border: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: '#111827', fontFamily: 'serif' }}>Edit Product</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Row 1: Name */}
                    <div>
                        <label style={labelStyle}>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="e.g. Royal Banarasi Silk Saree" />
                    </div>

                    {/* Row 2: Price + Discount */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Original Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} placeholder="e.g. 4999" />
                        </div>
                        <div>
                            <label style={labelStyle}>Discount Price (₹)</label>
                            <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} style={inputStyle} placeholder="e.g. 3499" />
                        </div>
                        <div>
                            <label style={labelStyle}>Stock Count</label>
                            <input type="number" name="count" value={formData.count} onChange={handleChange} required style={inputStyle} placeholder="e.g. 50" />
                        </div>
                    </div>

                    {/* Row 3: Category */}
                    <div>
                        <label style={labelStyle}>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required style={{ ...inputStyle, backgroundColor: 'white' }}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Row 4: Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="3"
                            style={{ ...inputStyle, fontFamily: 'sans-serif', resize: 'vertical' }}
                            placeholder="Describe the product fabric, design, occasion..."
                        />
                    </div>

                    {/* Row 5: Images — 5 slots */}
                    <div>
                        <label style={{ ...labelStyle, fontSize: '1rem' }}>
                            Product Images
                            <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: '0.5rem' }}>
                                (up to {MAX_IMAGES} — first image is the primary)
                            </span>
                        </label>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                            {formData.images.map((img, idx) => (
                                <div key={idx} style={{
                                    border: img ? '2px solid #4f46e5' : '2px dashed #d1d5db',
                                    borderRadius: '0.75rem',
                                    padding: '0.6rem',
                                    background: '#fafafa',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem',
                                    position: 'relative',
                                }}>
                                    {/* Slot label */}
                                    <span style={{
                                        fontSize: '0.68rem', fontWeight: '700',
                                        color: idx === 0 ? '#4f46e5' : '#9ca3af',
                                        textAlign: 'center', marginBottom: '0.2rem',
                                    }}>
                                        {idx === 0 ? '★ PRIMARY' : `Image ${idx + 1}`}
                                    </span>

                                    {/* Preview */}
                                    {img ? (
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={img}
                                                alt={`Preview ${idx + 1}`}
                                                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', borderRadius: '0.5rem' }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                            <button
                                                type="button"
                                                title="Remove"
                                                onClick={() => handleImageUrl(idx, '')}
                                                style={{
                                                    position: 'absolute', top: '4px', right: '4px',
                                                    background: 'rgba(255,255,255,0.9)', border: 'none',
                                                    width: '20px', height: '20px', borderRadius: '50%',
                                                    cursor: 'pointer', fontSize: '0.75rem', lineHeight: '1',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#ef4444', fontWeight: 'bold',
                                                }}
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: '100%', aspectRatio: '3/4', background: '#f3f4f6',
                                            borderRadius: '0.5rem', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color: '#d1d5db', fontSize: '1.5rem',
                                        }}>📷</div>
                                    )}

                                    {/* File upload */}
                                    <label style={{ cursor: 'pointer' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={e => handleFileChange(idx, e.target.files[0])}
                                        />
                                        <div style={{
                                            textAlign: 'center', fontSize: '0.7rem', fontWeight: '600',
                                            color: '#6b7280', padding: '0.3rem', borderRadius: '0.4rem',
                                            background: '#f3f4f6', cursor: 'pointer',
                                        }}>
                                            📁 Upload
                                        </div>
                                    </label>

                                    {/* URL input */}
                                    <input
                                        type="text"
                                        placeholder="or paste URL"
                                        value={img}
                                        onChange={e => handleImageUrl(idx, e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.3rem 0.5rem',
                                            borderRadius: '0.4rem', border: '1px solid #e5e7eb',
                                            fontSize: '0.65rem', color: '#374151', boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 6: Video URL */}
                    <div>
                        <label style={labelStyle}>Product Video (Optional)</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="e.g. https://www.youtube.com/watch?v=... or .mp4 link"
                                />
                                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                    Provide a direct link to an MP4 or YouTube embed URL for the 360°/Video view.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4b5563' }}>OR</span>
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        onChange={e => handleVideoFileChange(e.target.files[0])}
                                    />
                                    <div style={{
                                        padding: '0.85rem 1.5rem', borderRadius: '0.65rem',
                                        background: '#f3f4f6', color: '#4f46e5',
                                        fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #e5e7eb',
                                        textAlign: 'center', transition: 'background 0.2s'
                                    }}
                                        onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                                        onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
                                    >
                                        🎥 Upload File
                                    </div>
                                </label>
                            </div>
                        </div>

                        {formData.videoUrl && formData.videoUrl.startsWith('data:video') && (
                            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: '600', display: 'inline-block' }}>
                                ✓ Local video file selected successfully
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={{
                            marginTop: '0.5rem', width: '100%', padding: '1.25rem',
                            fontSize: '1.05rem', fontWeight: '700', color: 'white',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none', borderRadius: '1rem', cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
