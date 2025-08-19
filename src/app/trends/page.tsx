'use client';

import GlobalTrends from '@/components/GlobalTrends';

export default function TrendsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <GlobalTrends />
        </div>
      </main>
    </div>
  );
}

