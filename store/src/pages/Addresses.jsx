import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Plus, Trash2, Edit2, ArrowLeft, Home, Briefcase, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Home',
        fullName: '',
        mobile: '',
        pincode: '',
        address: '',
        city: '',
        state: 'Kerala'
    });

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || !user.loggedIn) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const identifier = user.email || user.mobile;
                const response = await axios.get(`${API_BASE_URL}/user/profile/${identifier}`);
                setAddresses(response.data.addresses || []);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedAddresses = [...addresses];

        if (editingIndex !== null) {
            updatedAddresses[editingIndex] = formData;
        } else {
            updatedAddresses.push(formData);
        }

        try {
            const identifier = user.email || user.mobile;
            await axios.put(`${API_BASE_URL}/user/addresses`, {
                identifier,
                addresses: updatedAddresses
            });
            setAddresses(updatedAddresses);
            setShowForm(false);
            setEditingIndex(null);
            setFormData({
                type: 'Home',
                fullName: '',
                mobile: '',
                pincode: '',
                address: '',
                city: '',
                state: 'Kerala'
            });
            alert(editingIndex !== null ? 'Address updated!' : 'Address added!');
        } catch (error) {
            console.error("Error updating addresses:", error);
            alert('Failed to save address.');
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(addresses[index]);
        setShowForm(true);
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        const updatedAddresses = addresses.filter((_, i) => i !== index);
        try {
            const identifier = user.email || user.mobile;
            await axios.put(`${API_BASE_URL}/user/addresses`, {
                identifier,
                addresses: updatedAddresses
            });
            setAddresses(updatedAddresses);
            alert('Address deleted!');
        } catch (error) {
            console.error("Error deleting address:", error);
            alert('Failed to delete address.');
        }
    };

    if (loading) return <div className="loading">Loading your addresses...</div>;

    return (
        <div className="addresses-page-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/profile')}
                    className="back-btn"
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                >
                    <ArrowLeft size={20} /> Back to Profile
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>My Addresses</h1>
                    {!showForm && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditingIndex(null);
                                setFormData({ type: 'Home', fullName: '', mobile: '', pincode: '', address: '', city: '', state: 'Kerala' });
                            }}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
                        >
                            <Plus size={20} /> Add New
                        </button>
                    )}
                </div>

                {showForm ? (
                    <div className="address-form-card" style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingIndex !== null ? 'Edit Address' : 'Add New Address'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Address Type</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                borderRadius: '0.75rem',
                                                border: formData.type === type ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                                                background: formData.type === type ? '#f0f9ff' : 'white',
                                                color: formData.type === type ? '#4f46e5' : '#64748b',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {type === 'Home' && <Home size={16} style={{ marginRight: '0.5rem' }} />}
                                            {type === 'Work' && <Briefcase size={16} style={{ marginRight: '0.5rem' }} />}
                                            {type === 'Other' && <Info size={16} style={{ marginRight: '0.5rem' }} />}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mobile Number</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>House No, Building, Street, Area</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}></textarea>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>State</label>
                                    <select name="state" value={formData.state} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Delhi">Delhi</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '1rem', borderRadius: '0.75rem' }}>Save Address</button>
                            </div>
                        </form>
                    </div>
                ) : null}

                <div className="addresses-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {addresses.length === 0 && !showForm ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '1.5rem', color: '#94a3b8' }}>
                            <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>You haven't saved any addresses yet.</p>
                        </div>
                    ) : (
                        addresses.map((addr, index) => (
                            <div key={index} className="address-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ background: '#f0f9ff', color: '#4f46e5', padding: '0.75rem', borderRadius: '0.75rem', height: 'fit-content' }}>
                                        {addr.type === 'Home' && <Home size={24} />}
                                        {addr.type === 'Work' && <Briefcase size={24} />}
                                        {addr.type === 'Other' && <MapPin size={24} />}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{addr.fullName}</span>
                                            <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '1rem', textTransform: 'uppercase' }}>{addr.type}</span>
                                        </div>
                                        <p style={{ color: '#64748b', margin: '0.25rem 0', lineHeight: '1.5' }}>{addr.address}</p>
                                        <p style={{ color: '#64748b', margin: '0.25rem 0' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                                        <p style={{ color: '#1e293b', fontWeight: '600', marginTop: '0.75rem', fontSize: '0.9rem' }}>Phone: {addr.mobile}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }} title="Edit"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} title="Delete"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Addresses;
