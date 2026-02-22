import { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import axios from 'axios';

const Signup = ({ onAuthSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match. Please try again.");
            return;
        }

        setLoading(true);
        console.log("Attempting signup with:", { name: name.trim(), email: email.trim().toLowerCase() });

        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobile: mobile.trim(),
                password: password
            });
            console.log("Signup response data:", response.data);

            if (response.data && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (onAuthSuccess) onAuthSuccess();
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error("Signup frontend error:", err);
            const msg = err.response?.data?.message || err.message || 'Error creating account. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Eye icon SVGs (inline, no dependency needed)
    const EyeOpen = () => (
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
    );
    const EyeClosed = () => (
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
    );

    return (
        <div className="store-auth-page">
            {/* Animated background blobs */}
            <div className="store-auth-bg">
                <div className="store-blob store-blob-1"></div>
                <div className="store-blob store-blob-2"></div>
                <div className="store-blob store-blob-3"></div>
            </div>

            <div className="store-auth-card">
                {/* Left — branding panel */}
                <div className="store-auth-left hide-on-mobile">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                        alt="Fashion"
                        className="store-auth-img"
                    />
                    <div className="store-auth-overlay">
                        <div className="store-auth-brand">
                            <span className="store-auth-brand-icon">✦</span>
                            <h1>ChicBoutique</h1>
                            <p>Join thousands of fashion lovers today.</p>
                        </div>
                    </div>
                </div>

                {/* Right — form panel */}
                <div className="store-auth-right" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                    <div className="store-auth-form-wrap">
                        {/* Mobile brand */}
                        <div className="store-auth-mobile-brand show-on-mobile">
                            <span>✦</span> ChicBoutique
                        </div>

                        <h2 className="store-auth-title">Create account</h2>
                        <p className="store-auth-subtitle">Start your fashion journey today</p>

                        <form onSubmit={handleSubmit} className="store-auth-form" noValidate>

                            {/* Error */}
                            {error && (
                                <div className="store-auth-error" role="alert">
                                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="store-auth-field">
                                <label htmlFor="su-name" className="store-auth-label">Full Name</label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        id="su-name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setError(''); }}
                                        className="store-auth-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="store-auth-field">
                                <label htmlFor="su-email" className="store-auth-label">Email Address</label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <input
                                        id="su-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        className="store-auth-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="store-auth-field">
                                <label htmlFor="su-mobile" className="store-auth-label">Mobile Number <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span></label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <input
                                        id="su-mobile"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="+91 Mobile number"
                                        value={mobile}
                                        maxLength={10}
                                        onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                                        className="store-auth-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="store-auth-field">
                                <label htmlFor="su-password" className="store-auth-label">Password</label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        id="su-password"
                                        type={showPwd ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="At least 6 characters"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        className="store-auth-input"
                                        disabled={loading}
                                    />
                                    <button type="button" className="store-toggle-pwd" onClick={() => setShowPwd(p => !p)} tabIndex={-1} aria-label="Toggle password">
                                        {showPwd ? <EyeOpen /> : <EyeClosed />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="store-auth-field">
                                <label htmlFor="su-confirm" className="store-auth-label">Confirm Password</label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        id="su-confirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                                        className={`store-auth-input ${confirmPassword && confirmPassword !== password ? 'store-auth-input--error' : ''}`}
                                        disabled={loading}
                                    />
                                    <button type="button" className="store-toggle-pwd" onClick={() => setShowConfirm(p => !p)} tabIndex={-1} aria-label="Toggle confirm password">
                                        {showConfirm ? <EyeOpen /> : <EyeClosed />}
                                    </button>
                                </div>
                                {/* Live mismatch hint */}
                                {confirmPassword && confirmPassword !== password && (
                                    <span style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '0.2rem' }}>
                                        Passwords don't match
                                    </span>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className={`store-auth-btn ${loading ? 'store-auth-btn--loading' : ''}`}
                                disabled={loading}
                                style={{ marginTop: '0.25rem' }}
                            >
                                {loading ? (
                                    <><span className="store-spinner"></span> Creating account…</>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <p className="store-auth-switch">
                            Already have an account?{' '}
                            <Link to="/login" className="store-auth-link">Sign In</Link>
                        </p>
                        <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                className="store-auth-link"
                                style={{ fontSize: '0.85rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                onClick={() => alert("Password reset functionality coming soon!")}
                            >
                                Forgot Password?
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
