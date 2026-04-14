import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#5D1C6A' }}>
      <div className="rounded-2xl shadow-2xl p-10 w-full max-w-md text-center" style={{ backgroundColor: '#FFF1D3' }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#5D1C6A' }}>
            Smart Pantry
          </h1>
          <p className="text-lg" style={{ color: '#CA5995' }}>Discover recipes with your ingredients</p>
        </div>
        
        <div className="space-y-4 mt-10">
          <Link
            href="/pantry"
            className="block font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
          >
            Start Cooking
          </Link>
          <Link
            href="/login"
            className="block font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#FFB090', color: '#5D1C6A' }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
          >
            Create Account
          </Link>
        </div>

        <p className="text-sm mt-8" style={{ color: '#CA5995' }}>
          Find the perfect recipes based on what you have in your kitchen
        </p>
      </div>
    </div>
  );
}
