import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [checkoutStep, setCheckoutStep] = useState(1); // 1: Shipping, 2: Payment
    const [formData, setFormData] = useState({
        email: '',
        newsletter: true,
        country: 'India',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: 'Kerala',
        pincode: '',
        phone: '',
        paymentMethod: 'razorpay_link', // Default to the Quick Pay Link
        billingAddress: 'same'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (savedCart.length === 0) {
            navigate('/cart');
        }
        setCart(savedCart);
    }, [navigate]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (checkoutStep === 1) {
            setCheckoutStep(2);
            return;
        }

        if (formData.paymentMethod === 'razorpay') {
            // Automated payment removed
        } else {
            // Quick Pay Link, UPI, Bank, or COD
            placeOrder(formData);
        }
    };

    const placeOrder = async (orderData) => {
        const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);
        const order = {
            customer: orderData,
            items: cart,
            total: totalAmount,
            date: new Date().toISOString(),
            status: 'Pending'
        };

        try {
            const response = await axios.post('http://localhost:5000/api/orders', order);
            if (response.status === 201 || response.status === 200) {
                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('cartUpdated'));
                alert('Order placed successfully! Redirecting home...');
                navigate('/');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Failed to place order. Please try again.');
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

    if (checkoutStep === 1) {
        return (
            <div style={{ padding: '2rem 5%', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap-reverse' }}>
                        <div style={{ flex: 1.5, backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
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
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Shipping Information</h1>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <section>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Contact Information</h2>
                                    <input type="text" name="email" placeholder="Email or mobile phone number" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none' }} />
                                </section>
                                <section>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Shipping Address</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required style={{ flex: 1, padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                                            <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required style={{ flex: 1, padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                                        </div>
                                        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required style={{ flex: 1, padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                                            <select name="state" value={formData.state} onChange={handleChange} style={{ flex: 1, padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                                                <option value="Kerala">Kerala</option>
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                <option value="Karnataka">Karnataka</option>
                                            </select>
                                            <input type="text" name="pincode" placeholder="PIN code" value={formData.pincode} onChange={handleChange} required style={{ flex: 1, padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                                        </div>
                                        <input type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                                    </div>
                                </section>
                                <button type="submit" style={{ width: '100%', padding: '1.25rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>Continue to Payment</button>
                            </form>
                        </div>
                        {/* Order Summary Sidebar */}
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Order Summary</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {cart.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.name}</p>
                                            <p style={{ fontWeight: '600' }}>₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                                    <span>Total</span>
                                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '1000px', minHeight: '600px', backgroundColor: 'white', borderRadius: '1.5rem', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
                {/* Left Panel */}
                <div style={{ flex: '1.2', background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)', padding: '2.5rem', color: 'white', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 'bold' }}>SW</div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Shopping World</h2>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '1rem' }}>
                        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Paying Amount</p>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: '800' }}>₹{totalAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div style={{ marginTop: 'auto', opacity: 0.7, fontSize: '0.85rem' }}>
                        <p>Secured by 256-bit SSL encryption</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ flex: '3', display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <button onClick={() => setCheckoutStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>← Change Address</button>
                        <h3 style={{ fontWeight: '600', fontSize: '1rem' }}>Select Payment Method</h3>
                        <div style={{ width: '2rem' }}></div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                        <div style={{ flex: '1', backgroundColor: '#f9fafb', borderRight: '1px solid #f3f4f6', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                <div onClick={() => setFormData({ ...formData, paymentMethod: 'razorpay_link' })} style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: formData.paymentMethod === 'razorpay_link' ? 'white' : 'transparent', boxShadow: formData.paymentMethod === 'razorpay_link' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}>
                                    <p style={{ fontWeight: '600' }}>Quick Pay ⚡</p>
                                    <small>Direct Razorpay Link</small>
                                </div>
                                <div onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })} style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: formData.paymentMethod === 'cod' ? 'white' : 'transparent', boxShadow: formData.paymentMethod === 'cod' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}>
                                    <p style={{ fontWeight: '600' }}>Cash on Delivery</p>
                                    <small>Pay at delivery</small>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: '1.5', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                            {formData.paymentMethod === 'razorpay_link' && (
                                <div style={{ width: '100%' }}>
                                    <h4 style={{ marginBottom: '1.5rem' }}>Quick Pay via Link</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>Pay ₹{totalAmount.toLocaleString('en-IN')} using the secure link below.</p>
                                    <a href="https://razorpay.me/@koonanpaulsonkiran" target="_blank" rel="noopener noreferrer" style={{ display: 'block', backgroundColor: '#2563eb', color: 'white', padding: '1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>Pay Now</a>
                                    <button onClick={() => placeOrder(formData)} style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>I've Sent the Payment</button>
                                </div>
                            )}
                            {formData.paymentMethod === 'cod' && (
                                <div style={{ width: '100%' }}>
                                    <h4 style={{ marginBottom: '1.5rem' }}>Cash on Delivery</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>You will pay for your order when it arrives at your doorstep.</p>
                                    <button onClick={() => placeOrder(formData)} style={{ width: '100%', padding: '1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Confirm Order</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
