'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bot, Home, LogOut, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem('userId')));
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const isOnPantry = pathname === '/pantry';
  const isOnHome = pathname === '/';
  const isOnAssistant = pathname === '/dashboard';
  const isOnLogin = pathname === '/login';
  const isOnSignup = pathname === '/signup';

  const primaryBtn = 'inline-flex items-center gap-2 rounded-full border-2 border-[#ff7a00] bg-white px-5 py-2.5 text-base font-medium text-[#47392e] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fff6ec]';
  const activeBtn = 'inline-flex items-center gap-2 rounded-full border-2 border-[#ff7a00] bg-[#ff7a00] px-5 py-2.5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(255,122,0,0.2)]';

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between rounded-[24px] border border-white/70 bg-[#fffaf4]/95 px-4 py-3 shadow-[0_14px_30px_rgba(70,48,28,0.1)] backdrop-blur">
        <Link href="/" className="flex items-center gap-2 rounded-full border-2 border-[#ff7a00] bg-white px-4 py-2.5 font-semibold text-[#ff7a00] transition-all duration-200 hover:-translate-y-0.5">
          <Home className="h-4 w-4" />
          Home
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/pantry"
            className={isOnPantry ? activeBtn : primaryBtn}
          >
            <Sparkles className="h-4 w-4" />
            Pantry
          </Link>
          <Link
            href="/dashboard"
            className={isOnAssistant ? activeBtn : primaryBtn}
          >
            <Bot className="h-4 w-4" />
            Dashboard
          </Link>

          {!isHydrated ? (
            <div className="h-[42px] w-[180px] rounded-full border border-[#ffd0a3] bg-white/70" />
          ) : isAuthed ? (
            <>
              <Link href="/favorites" className={primaryBtn}>Favorites</Link>
              <Link href="/inventory" className={primaryBtn}>Inventory</Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[#2d241f] px-5 py-2.5 text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={isOnLogin ? activeBtn : primaryBtn}>Login</Link>
              <Link href="/signup" className={isOnSignup ? activeBtn : primaryBtn}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
