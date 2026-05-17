import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="theme-page">
        <div className="theme-wrap max-w-4xl">
          <div className="theme-card mt-12 p-10 text-center">
            <div className="mb-8">
              <h1 className="font-display text-6xl mb-2 text-[#16100c]">
                Welcome Back!
              </h1>
              <p className="text-lg text-[#7a6b5d]">You&apos;re all logged in and ready to go.</p>
            </div>

            <div className="mb-8 rounded-[24px] border border-[#ffd0a3] bg-[#fff3e4] p-8">
              <h2 className="mb-2 text-lg font-semibold text-[#2d241f]">
                Get Started with Smart Pantry
              </h2>
              <p className="text-[#47392e]">
                Head to the Pantry tab above to search for recipes based on ingredients you have at home, or manage your inventory!
              </p>
            </div>

            <Link
              href="/pantry"
              className="theme-btn-accent px-8"
            >
              Go to Pantry →
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
