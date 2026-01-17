'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  free: {
    total: number;
    bySign: Record<string, number>;
  };
  paid: {
    total: number;
    bySign: Record<string, number>;
  };
  combined: {
    total: number;
  };
  lastUpdated: string;
  message?: string;
}

export default function AdminAnalyticsPage() {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/analytics/stats?pin=${pin}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch analytics');
        return;
      }

      setAnalytics(data);
      setAuthenticated(true);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics();
  };

  // Auto-refresh every 30 seconds when authenticated
  useEffect(() => {
    if (!authenticated) return;

    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [authenticated, pin]);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-fire-gold mb-6 text-center">
            Admin Analytics
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Enter Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest"
                placeholder="••••••"
                maxLength={6}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || pin.length < 6}
              className="w-full bg-fire-gold text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'View Analytics'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-fire-gold">
            Oracle Analytics Dashboard
          </h1>
          <a
            href="/"
            className="text-gray-400 hover:text-white underline"
          >
            ← Back to Home
          </a>
        </div>

        {analytics?.message && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-sm">{analytics.message}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Combined Total */}
          <div className="bg-gradient-to-br from-fire-gold/20 to-red-900/20 border border-fire-gold/50 rounded-2xl p-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Total Oracles</p>
            <p className="text-5xl font-bold text-fire-gold">{analytics?.combined?.total || 0}</p>
            <p className="text-gray-500 text-xs mt-2">Free + Paid Combined</p>
          </div>

          {/* Free Total */}
          <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Free Readings</p>
            <p className="text-5xl font-bold text-green-400">{analytics?.free?.total || 0}</p>
            <p className="text-gray-500 text-xs mt-2">Zodiac Previews Generated</p>
          </div>

          {/* Paid Total */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Paid Oracles</p>
            <p className="text-5xl font-bold text-yellow-400">{analytics?.paid?.total || 0}</p>
            <p className="text-gray-500 text-xs mt-2">Revenue: ${((analytics?.paid?.total || 0) * 8.88).toFixed(2)}</p>
          </div>
        </div>

        {/* Breakdown Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free by Sign */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Free Readings by Sign</h2>
            {Object.keys(analytics?.free?.bySign || {}).length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="pb-2">Zodiac Sign</th>
                    <th className="pb-2 text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics?.free?.bySign || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([sign, count]) => (
                      <tr key={sign} className="border-t border-gray-800">
                        <td className="py-2 text-white">{sign}</td>
                        <td className="py-2 text-right text-green-400 font-mono">{count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No free readings yet</p>
            )}
          </div>

          {/* Paid by Sign */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Paid Oracles by Sign</h2>
            {Object.keys(analytics?.paid?.bySign || {}).length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="pb-2">Zodiac Sign</th>
                    <th className="pb-2 text-right">Count</th>
                    <th className="pb-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics?.paid?.bySign || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([sign, count]) => (
                      <tr key={sign} className="border-t border-gray-800">
                        <td className="py-2 text-white">{sign}</td>
                        <td className="py-2 text-right text-yellow-400 font-mono">{count}</td>
                        <td className="py-2 text-right text-gray-400 font-mono">${(count * 8.88).toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No paid oracles yet</p>
            )}
          </div>
        </div>

        {/* Marketing Milestone */}
        {(analytics?.combined?.total || 0) >= 100 && (
          <div className="mt-8 bg-fire-gold/10 border border-fire-gold rounded-2xl p-6 text-center">
            <p className="text-fire-gold text-lg font-bold mb-2">
              Marketing Milestone Reached!
            </p>
            <p className="text-white">
              Over {analytics?.combined?.total} Oracles generated with complete privacy!
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Ready to promote: &ldquo;Trusted by {analytics?.combined?.total}+ users with zero data collection&rdquo;
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'N/A'}</p>
          <p className="mt-1">Auto-refreshes every 30 seconds</p>
        </div>
      </div>
    </main>
  );
}
