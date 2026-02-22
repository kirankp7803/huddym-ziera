import { useState, useRef } from 'react';

// Admin credentials — change these or connect to a real API as needed
const ADMIN_EMAIL = 'admin@shop.com';
const ADMIN_PASSWORD = 'admin123';

const SignIn = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const mountedRef = useRef(true);   // guard against state updates after unmount

    // track mounted state
    useState(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);

        // Small delay for UX (remove setTimeout to make it instant)
        const timer = setTimeout(() => {
            if (trimmedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD) {
                // Success — App.jsx takes over, no navigate needed
                onLogin();
            } else {
                if (mountedRef.current) {
                    setError('❌ Wrong email or password.\nUse: admin@shop.com / admin123');
                    setLoading(false);
                }
            }
        }, 800);

        return () => clearTimeout(timer);
    };

    return (
        <div className="signin-page">
            {/* Animated background blobs */}
            <div className="signin-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="signin-card">
                {/* Header */}
                <div className="signin-header">
                    <div className="signin-logo">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="12" fill="url(#logoGrad)" />
                            <path d="M12 20l6 6 10-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="signin-title">Admin Portal</h1>
                    <p className="signin-subtitle">Sign in to manage your store</p>
                </div>

                {/* Form */}
                <form className="signin-form" onSubmit={handleSubmit} noValidate>

                    {/* Error message */}
                    {error && (
                        <div className="signin-error" role="alert">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span style={{ whiteSpace: 'pre-line' }}>{error}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div className="signin-field">
                        <label htmlFor="admin-email" className="signin-label">Email Address</label>
                        <div className="signin-input-wrap">
                            <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <input
                                id="admin-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="admin@shop.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                className="signin-input"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="signin-field">
                        <label htmlFor="admin-password" className="signin-label">Password</label>
                        <div className="signin-input-wrap">
                            <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <input
                                id="admin-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                className="signin-input"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label="Toggle password visibility"
                                tabIndex={-1}
                            >
                                {showPassword ? (
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
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`signin-btn ${loading ? 'signin-btn--loading' : ''}`}
                        disabled={loading}
                        id="signin-submit-btn"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in…
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Hint box */}
                <div className="signin-hint">
                    <p>Demo credentials</p>
                    <code>admin@shop.com &nbsp;/&nbsp; admin123</code>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
