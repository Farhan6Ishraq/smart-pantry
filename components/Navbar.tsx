'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const isOnPantry = pathname === '/pantry';
  const isOnDashboard = pathname === '/dashboard';

  return (
    <nav className="shadow-md" style={{ backgroundColor: '#FFF1D3' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity" style={{ color: '#5D1C6A' }}>
          <span>Smart Pantry</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isOnDashboard ? '' : 'hover:opacity-75'
            }`}
            style={{
              backgroundColor: isOnDashboard ? '#CA5995' : 'transparent',
              color: isOnDashboard ? '#FFF1D3' : '#5D1C6A'
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/pantry"
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isOnPantry ? '' : 'hover:opacity-75'
            }`}
            style={{
              backgroundColor: isOnPantry ? '#CA5995' : 'transparent',
              color: isOnPantry ? '#FFF1D3' : '#5D1C6A'
            }}
          >
            Pantry
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
