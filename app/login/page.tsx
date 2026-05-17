'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

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
    <div className="theme-page">
      <Navbar />
      <div className="theme-wrap flex items-center justify-center pt-8">
      <div className="theme-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl text-[#16100c]">Welcome Back</h1>
          <p className="mt-2 text-[#7a6b5d]">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-2xl border border-[#f5c2c7] bg-[#ffe5de] p-4 text-[#842029]">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-[#2d241f]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="theme-input"
            />
          </div>
          
          <div>
            <label className="mb-2 block font-semibold text-[#2d241f]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="theme-input"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#ff7a00] py-3 px-4 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 border-t border-[#ffd0a3] pt-6">
          <p className="text-center text-[#2d241f]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-[#ff7a00] hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
