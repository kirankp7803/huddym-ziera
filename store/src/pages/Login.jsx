import { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import axios from 'axios';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobileNumber.length !== 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        // Mock OTP sending
        alert(`OTP sent to ${mobileNumber}. (Use 1234 to login)`);
        setShowOtpInput(true);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/login-otp`, {
                mobile: mobileNumber,
                otp: otp
            });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert('Login Successful!');
            window.location.href = '/home';
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: '900px', backgroundColor: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                {/* Image Section */}
                <div className="hide-on-mobile" style={{ flex: 1, position: 'relative' }}>
                    <img
                        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                        alt="Fashion"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
                        <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Welcome</h2>
                    </div>
                </div>

                {/* Form Section */}
                <div style={{ flex: 1, padding: '3rem' }}>


                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem', fontSize: '2rem' }}>Login</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Enter your mobile number to access your account.</p>

                    {!showOtpInput ? (
                        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Mobile Number</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>+91</span>
                                    <input
                                        type="tel"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} // Only numbers
                                        required
                                        maxLength="10"
                                        placeholder="Enter 10-digit number"
                                        className="form-input"
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem' }}>Send OTP</button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                                <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>OTP sent to <strong>+91 {mobileNumber}</strong></p>
                                <button
                                    type="button"
                                    onClick={() => setShowOtpInput(false)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.25rem', textDecoration: 'underline' }}
                                >
                                    Change Number
                                </button>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength="4"
                                    placeholder="• • • •"
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', textAlign: 'center', letterSpacing: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
