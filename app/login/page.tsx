'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store user ID in localStorage
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#5D1C6A' }}>
      <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md" style={{ backgroundColor: '#FFF1D3' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#5D1C6A' }}>Welcome Back</h1>
          <p className="mt-2" style={{ color: '#CA5995' }}>Sign in to your account</p>
        </div>
        
        {error && (
          <div className="border-l-4 p-4 rounded-lg mb-6" style={{ backgroundColor: '#FFB090', borderColor: '#CA5995', color: '#5D1C6A' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-2" style={{ color: '#5D1C6A' }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200"
              style={{ borderColor: '#CA5995', color: '#5D1C6A' }}
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2" style={{ color: '#5D1C6A' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200"
              style={{ borderColor: '#CA5995', color: '#5D1C6A' }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #CA5995' }}>
          <p className="text-center" style={{ color: '#5D1C6A' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold hover:underline transition-colors" style={{ color: '#CA5995' }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
