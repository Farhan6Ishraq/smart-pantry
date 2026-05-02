import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen p-4" style={{ backgroundColor: '#FFF1D3' }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl shadow-2xl p-10 text-center mt-12" style={{ backgroundColor: '#FFF1D3' }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#5D1C6A' }}>
                Welcome Back!
              </h1>
              <p className="text-lg" style={{ color: '#CA5995' }}>You&apos;re all logged in and ready to go.</p>
            </div>

            <div className="rounded-lg p-8 border mb-8" style={{ backgroundColor: '#FFB090', borderColor: '#CA5995' }}>
              <h2 className="font-semibold text-lg mb-2" style={{ color: '#5D1C6A' }}>
                Get Started with Smart Pantry
              </h2>
              <p style={{ color: '#5D1C6A' }}>
                Head to the Pantry tab above to search for recipes based on ingredients you have at home, or manage your inventory!
              </p>
            </div>

            <Link
              href="/pantry"
              className="inline-block font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
            >
              Go to Pantry →
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
