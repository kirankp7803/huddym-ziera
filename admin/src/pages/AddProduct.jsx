import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        count: '',
        category: 'Saree',
        description: '',
        image: ''
    });

    const categories = ['Saree', 'Churidar', 'T-Shirt', 'Pants', 'Kurti', 'Lehenga', 'Jewelry', 'Footwear', 'Accessories'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/products`, formData);
            alert('Product added successfully!');
            navigate('/inventory');
        } catch (error) {
            console.error("Error adding product:", error);
            alert('Failed to add product.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/inventory')} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ← Back to Inventory
            </button>
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: '#111827', fontFamily: 'serif' }}>Add New Product</h2>
                <form onSubmit={handleSubmit} className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Original Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Discount Price (₹)</label>
                        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Product Count (Stock)</label>
                        <input type="number" name="count" value={formData.count} onChange={handleChange} required style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', backgroundColor: 'white' }}>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Product Image</label>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <input
                                    type="file"
                                    id="productImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', marginBottom: '1rem', backgroundColor: '#f9fafb' }}
                                />
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>Alternatively, provide an image URL</label>
                                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem' }} />
                            </div>

                            {formData.image && (
                                <div style={{ border: '1px solid #f3f4f6', borderRadius: '1rem', padding: '0.5rem', background: '#fff' }}>
                                    <img src={formData.image} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '0.75rem' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '1rem', fontFamily: 'sans-serif' }}></textarea>
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: 'white',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                                border: 'none',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 99, 235, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)';
                            }}
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Add to Inventory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
