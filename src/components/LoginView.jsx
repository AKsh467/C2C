import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const LoginView = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        const savedEmail = localStorage.getItem('c2c_saved_email');
        if (savedEmail) { setEmail(savedEmail); setRememberMe(true); }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!email.includes('@')) return setError('Please enter a valid email address.');
        if (password.length < 6) return setError('Password must be at least 6 characters.');
        if (isRegistering && name.trim().length < 2) return setError('Please enter your full name.');

        setIsLoading(true);

        try {
            const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
            const body = isRegistering ? { name, email, password } : { email, password };

            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Something went wrong. Please try again.');
                return;
            }

            // Persist JWT
            localStorage.setItem('c2c_token', data.token);

            if (rememberMe) {
                localStorage.setItem('c2c_saved_email', email);
            } else {
                localStorage.removeItem('c2c_saved_email');
            }

            onLogin(data.user);

        } catch (err) {
            setError('Could not connect to the server. Make sure it is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', width: '100%', padding: '2rem' }}>
            <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.3)' }}>

                {/* Decorative glows */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-gradient)', borderRadius: '50%', filter: 'blur(50px)', opacity: 0.3, zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--accent-purple)', borderRadius: '50%', filter: 'blur(50px)', opacity: 0.2, zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div className="flex justify-center" style={{ marginBottom: '1rem' }}>
                            <div className="animate-float" style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <ShieldCheck size={32} color="var(--accent-indigo)" />
                            </div>
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to C2C</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            {isRegistering ? 'Create your account to get started.' : 'Sign in to access your execution plans.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-col gap-4">

                        {/* Name field (register only) */}
                        {isRegistering && (
                            <div className="fade-in">
                                <label className="input-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        className="input-base"
                                        placeholder="Jane Doe"
                                        style={{ paddingLeft: '2.8rem' }}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={isRegistering}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="input-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="email"
                                    className="input-base"
                                    placeholder="builder@example.com"
                                    style={{ paddingLeft: '2.8rem' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus={!isRegistering}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="input-label flex justify-between">
                                Password
                                {!isRegistering && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', cursor: 'pointer' }}>Forgot?</span>
                                )}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-base"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        {!isRegistering && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }}
                                />
                                <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    Remember me for 30 days
                                </label>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', padding: '0.85rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="loading-dot" style={{ width: '8px', height: '8px', animationDelay: '0s' }} />
                                    <span className="loading-dot" style={{ width: '8px', height: '8px', animationDelay: '0.2s' }} />
                                    <span className="loading-dot" style={{ width: '8px', height: '8px', animationDelay: '0.4s' }} />
                                </span>
                                : <>{isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight size={18} /></>
                            }
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                        <span
                            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                            style={{ color: 'var(--accent-indigo)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {isRegistering ? 'Sign In' : 'Register Now'}
                        </span>
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-2" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        <ShieldCheck size={14} color="var(--success-color)" />
                        <span>Passwords are hashed with bcrypt · JWT session tokens</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
