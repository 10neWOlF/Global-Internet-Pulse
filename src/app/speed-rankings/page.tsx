'use client';

import InternetSpeedRankings from '@/components/InternetSpeedRankings';

export default function SpeedRankingsPage() {
  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Midnight Mist Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
          `,
        }}
      />
      
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Global Internet Speed Rankings</h1>
            <p className="text-gray-300">
              Compare internet speeds across countries worldwide. Data sourced from Wikipedia and updated monthly.
            </p>
          </div>

          {/* Speed Rankings Component */}
          <InternetSpeedRankings />
        </div>
      </main>
    </div>
  );
}
