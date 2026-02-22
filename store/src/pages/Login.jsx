import { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import axios from 'axios';

const Login = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, {
                email: email.trim().toLowerCase(),
                password: password.trim()
            });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (onAuthSuccess) onAuthSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="store-auth-page">
            {/* Animated blobs */}
            <div className="store-auth-bg">
                <div className="store-blob store-blob-1"></div>
                <div className="store-blob store-blob-2"></div>
                <div className="store-blob store-blob-3"></div>
            </div>

            <div className="store-auth-card">
                {/* Left — branding panel */}
                <div className="store-auth-left hide-on-mobile">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
                        alt="Fashion"
                        className="store-auth-img"
                    />
                    <div className="store-auth-overlay">
                        <div className="store-auth-brand">
                            <span className="store-auth-brand-icon">✦</span>
                            <h1>ChicBoutique</h1>
                            <p>Elegance in every thread, style in every stitch.</p>
                        </div>
                    </div>
                </div>

                {/* Right — form panel */}
                <div className="store-auth-right">
                    <div className="store-auth-form-wrap">
                        {/* Mobile brand */}
                        <div className="store-auth-mobile-brand show-on-mobile">
                            <span>✦</span> ChicBoutique
                        </div>

                        <h2 className="store-auth-title">Welcome back</h2>
                        <p className="store-auth-subtitle">Sign in to continue shopping</p>

                        <form onSubmit={handleSubmit} className="store-auth-form" noValidate>
                            {error && (
                                <div className="store-auth-error" role="alert">
                                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="store-auth-field">
                                <label htmlFor="login-email" className="store-auth-label">Email Address</label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <input
                                        id="login-email"
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

                            {/* Password */}
                            <div className="store-auth-field">
                                <label htmlFor="login-password" className="store-auth-label">Password</label>
                                <div className="store-auth-input-wrap">
                                    <svg className="store-input-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        id="login-password"
                                        type={showPwd ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        className="store-auth-input"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="store-toggle-pwd"
                                        onClick={() => setShowPwd(p => !p)}
                                        tabIndex={-1}
                                        aria-label="Toggle password"
                                    >
                                        {showPwd ? (
                                            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                                    <button
                                        type="button"
                                        className="store-auth-link"
                                        style={{ fontSize: '0.82rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                        onClick={() => alert("Password reset functionality coming soon!")}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`store-auth-btn ${loading ? 'store-auth-btn--loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="store-spinner"></span> Signing in…</>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <p className="store-auth-switch">
                            Don't have an account?{' '}
                            <Link to="/signup" className="store-auth-link">Create one</Link>
                        </p>

                        {/* Demo Credentials Hint */}
                        <div className="store-auth-hint" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Demo credentials:</p>
                            <code style={{ fontSize: '0.85rem', color: '#fbbf24' }}>kirankp7803@gmail.com / kirankp2001</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
