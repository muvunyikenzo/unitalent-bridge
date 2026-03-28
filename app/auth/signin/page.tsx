'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register') {
      // Create account first
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }
    }

    // Sign in
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Navbar */}
      <nav style={{
        padding: '0 32px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <Link href="/" style={{
          fontWeight: '700',
          fontSize: '17px',
          textDecoration: 'none',
          color: '#111',
          letterSpacing: '-0.3px',
        }}>
          UniTalent Bridge
        </Link>
      </nav>

      {/* Form Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Title */}
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
            color: '#111',
          }}>
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ color: '#888', fontSize: '15px', marginBottom: '32px' }}>
            {mode === 'signin'
              ? 'Sign in to your UniTalent Bridge account.'
              : 'Join the campus talent marketplace.'}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                }}>
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Aline Uwimana"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    fontSize: '15px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                    color: '#111',
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}>
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@student.ur.ac.rw"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '15px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#111',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}>
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '15px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#111',
                  backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: loading ? '#999' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {loading
                ? 'Please wait...'
                : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: '#ffffff',
                color: '#333',
                border: '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span>G</span>
              Continue with Google
            </button>
          </form>

          {/* Toggle */}
          <p style={{
            textAlign: 'center',
            marginTop: '28px',
            fontSize: '14px',
            color: '#888',
          }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'register' : 'signin'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#111',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline',
              }}
            >
              {mode === 'signin' ? 'Register here' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>

    </main>
  );
}