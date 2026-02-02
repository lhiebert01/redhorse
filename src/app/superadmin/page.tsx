'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Prophecy } from '@/types/prophecy';
import { ZODIAC_ANIMALS, ZODIAC_ELEMENTS, ZodiacAnimal, ZodiacElement } from '@/constants/zodiac-data';

const SUPERADMIN_PIN = '142857';
const AUTH_STORAGE_KEY = 'superadmin_authenticated';

interface Filters {
  zodiacSign: ZodiacAnimal | 'all';
  zodiacElement: ZodiacElement | 'all';
  focusMode: string;
  editionFrom: number;
  editionTo: number;
}

export default function SuperAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Check sessionStorage on mount for persisted authentication
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);
  const [prophecies, setProphecies] = useState<Prophecy[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Prophecy | null>(null);
  const [viewMode, setViewMode] = useState<'raw' | 'branded'>('branded');
  const [filters, setFilters] = useState<Filters>({
    zodiacSign: 'all',
    zodiacElement: 'all',
    focusMode: 'all',
    editionFrom: 1,
    editionTo: 888,
  });
  const [backfillStatus, setBackfillStatus] = useState<string | null>(null);

  // Party Stats modal
  const [showPartyStats, setShowPartyStats] = useState(false);
  const [partyStatsLoading, setPartyStatsLoading] = useState(false);
  const [partyStats, setPartyStats] = useState<{
    passes: {
      total: number;
      byType: Record<string, number>;
      totalGamesAllowed: number;
      totalGamesPlayed: number;
      totalGamesRemaining: number;
    };
    games: {
      total: number;
      completed: number;
      inProgress: number;
    };
    players: {
      total: number;
      avgPerGame: number;
    };
    passList: Array<{
      party_code: string;
      pass_type: string;
      games_allowed: number;
      games_played: number;
      games_remaining: number;
      total_players: number;
      created_at: string;
      expires_at: string;
      is_expired: boolean;
    }>;
  } | null>(null);

  const fetchPartyStats = async () => {
    setPartyStatsLoading(true);
    try {
      const response = await fetch('/api/admin/party-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: SUPERADMIN_PIN }),
      });
      const data = await response.json();
      if (response.ok) {
        setPartyStats(data);
      } else {
        console.error('Error fetching party stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching party stats:', error);
    }
    setPartyStatsLoading(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SUPERADMIN_PIN) {
      setAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setPinError('');
    } else {
      setPinError('Invalid PIN');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setPin('');
  };

  const handleBackfillEditions = async () => {
    setBackfillStatus('Running backfill...');
    try {
      const response = await fetch('/api/admin/backfill-editions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: SUPERADMIN_PIN }),
      });
      const data = await response.json();
      if (response.ok) {
        setBackfillStatus(`✅ ${data.message}: ${data.updated} updated, ${data.alreadyCorrect} already correct`);
        // Refresh the list
        fetchProphecies();
      } else {
        setBackfillStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setBackfillStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchProphecies = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();

    let query = supabase
      .from('prophecies')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.zodiacSign !== 'all') {
      query = query.eq('zodiac_sign', filters.zodiacSign);
    }
    if (filters.zodiacElement !== 'all') {
      query = query.eq('zodiac_element', filters.zodiacElement);
    }
    if (filters.focusMode !== 'all') {
      query = query.eq('focus_mode', filters.focusMode);
    }
    if (filters.editionFrom > 1) {
      query = query.gte('edition_number', filters.editionFrom);
    }
    if (filters.editionTo < 888) {
      query = query.lte('edition_number', filters.editionTo);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching prophecies:', error);
    } else {
      setProphecies((data as Prophecy[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchProphecies();
    }
  }, [authenticated, filters]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handlePinSubmit} className="bg-gray-900 p-8 rounded-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-fire-gold mb-6 text-center">
            🔐 SuperAdmin Access
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Enter PIN to access the Image Browser
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg mb-4 text-center text-2xl tracking-widest"
            autoFocus
          />
          {pinError && (
            <p className="text-red-500 text-center mb-4">{pinError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-fire-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Access SuperAdmin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fire-gold mb-2">
              🔥 SuperAdmin Image Browser
            </h1>
            <p className="text-gray-400">
              Browse and quality-check generated talismans by zodiac, edition, and mode
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setShowPartyStats(true);
                fetchPartyStats();
              }}
              className="bg-orange-700 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🎮 Party Stats
            </button>
            <a
              href="/admin-test"
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              + Generate Test Oracle
            </a>
            <button
              onClick={handleBackfillEditions}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🔢 Backfill Editions
            </button>
            <button
              onClick={() => fetchProphecies()}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Backfill Status */}
        {backfillStatus && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            backfillStatus.startsWith('✅') ? 'bg-green-900/50 text-green-300' :
            backfillStatus.startsWith('❌') ? 'bg-red-900/50 text-red-300' :
            'bg-blue-900/50 text-blue-300'
          }`}>
            {backfillStatus}
            <button
              onClick={() => setBackfillStatus(null)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8 bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Zodiac Sign */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Zodiac Sign</label>
            <select
              value={filters.zodiacSign}
              onChange={(e) => setFilters({ ...filters, zodiacSign: e.target.value as ZodiacAnimal | 'all' })}
              className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded-lg"
            >
              <option value="all">All Signs</option>
              {ZODIAC_ANIMALS.map((animal) => (
                <option key={animal} value={animal}>{animal}</option>
              ))}
            </select>
          </div>

          {/* Zodiac Element */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Element</label>
            <select
              value={filters.zodiacElement}
              onChange={(e) => setFilters({ ...filters, zodiacElement: e.target.value as ZodiacElement | 'all' })}
              className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded-lg"
            >
              <option value="all">All Elements</option>
              {ZODIAC_ELEMENTS.map((element) => (
                <option key={element} value={element}>{element}</option>
              ))}
            </select>
          </div>

          {/* Focus Mode */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Oracle Mode</label>
            <select
              value={filters.focusMode}
              onChange={(e) => setFilters({ ...filters, focusMode: e.target.value })}
              className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded-lg"
            >
              <option value="all">All Modes</option>
              <option value="wealth">Wealth</option>
              <option value="power">Power</option>
              <option value="love">Love</option>
              <option value="shield">Shield</option>
            </select>
          </div>

          {/* Edition Range */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Edition From</label>
            <input
              type="number"
              min={1}
              max={888}
              value={filters.editionFrom}
              onChange={(e) => setFilters({ ...filters, editionFrom: parseInt(e.target.value) || 1 })}
              className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Edition To</label>
            <input
              type="number"
              min={1}
              max={888}
              value={filters.editionTo}
              onChange={(e) => setFilters({ ...filters, editionTo: parseInt(e.target.value) || 888 })}
              className="w-full bg-black border border-gray-700 text-white px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-gray-400 text-sm">View Mode:</span>
          <button
            onClick={() => setViewMode('branded')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              viewMode === 'branded'
                ? 'bg-fire-gold text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Branded
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              viewMode === 'raw'
                ? 'bg-fire-gold text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Raw AI
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-4">
        <p className="text-gray-400">
          {loading ? 'Loading...' : `Showing ${prophecies.length} oracles`}
        </p>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {prophecies.map((prophecy) => {
            const imageUrl = viewMode === 'branded'
              ? (prophecy.branded_image_url || prophecy.image_url)
              : prophecy.image_url;

            return (
              <div
                key={prophecy.id}
                onClick={() => setSelectedImage(prophecy)}
                className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-fire-gold transition-all"
              >
                {/* Thumbnail */}
                <div className="aspect-[9/16] relative bg-black">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={`${prophecy.zodiac_element} ${prophecy.zodiac_sign}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-fire-gold font-bold text-sm">
                      #{prophecy.edition_number}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {prophecy.focus_mode}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium truncate">
                    {prophecy.zodiac_element} {prophecy.zodiac_sign}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {prophecy.main_text}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-1">
                    Cert: {prophecy.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/2 bg-black p-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode('branded')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                      viewMode === 'branded' ? 'bg-fire-gold text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Branded
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                      viewMode === 'raw' ? 'bg-fire-gold text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Raw AI
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewMode === 'branded'
                    ? (selectedImage.branded_image_url || selectedImage.image_url || '')
                    : (selectedImage.image_url || '')
                  }
                  alt="Talisman"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-bold text-fire-gold mb-4">
                  {selectedImage.zodiac_element} {selectedImage.zodiac_sign}
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Edition</span>
                    <span className="text-white font-bold">
                      #{selectedImage.edition_number} of {selectedImage.total_editions}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Certificate</span>
                    <span className="text-white font-mono">
                      {selectedImage.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Oracle Mode</span>
                    <span className="text-white capitalize">{selectedImage.focus_mode}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Prophecy</span>
                    <span className="text-fire-gold font-bold">{selectedImage.main_text}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Fire Horse Relation</span>
                    <span className="text-white">{selectedImage.fire_horse_relation}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white">
                      {new Date(selectedImage.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* URLs */}
                <div className="mt-6 space-y-2">
                  <p className="text-gray-400 text-xs">Raw Image URL:</p>
                  <input
                    readOnly
                    value={selectedImage.image_url || ''}
                    className="w-full bg-black border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  {selectedImage.branded_image_url && (
                    <>
                      <p className="text-gray-400 text-xs mt-2">Branded Image URL:</p>
                      <input
                        readOnly
                        value={selectedImage.branded_image_url}
                        className="w-full bg-black border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                    </>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Party Stats Modal */}
      {showPartyStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-400">🎮 Party Trivia Stats</h2>
                <button
                  onClick={() => setShowPartyStats(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {partyStatsLoading ? (
                <div className="text-center py-12">
                  <div className="text-4xl animate-bounce">🎮</div>
                  <p className="text-gray-400 mt-4">Loading stats...</p>
                </div>
              ) : partyStats ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-orange-900/30 border border-orange-700 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-orange-400">{partyStats.passes.total}</div>
                      <div className="text-sm text-gray-400">Passes Purchased</div>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400">{partyStats.games.total}</div>
                      <div className="text-sm text-gray-400">Games Created</div>
                    </div>
                    <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-400">{partyStats.games.completed}</div>
                      <div className="text-sm text-gray-400">Games Completed</div>
                    </div>
                    <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400">{partyStats.players.total}</div>
                      <div className="text-sm text-gray-400">Total Players</div>
                    </div>
                  </div>

                  {/* Pass Type Breakdown */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">📊 Passes by Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(partyStats.passes.byType).map(([type, count]) => (
                        <div key={type} className="bg-gray-900 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-yellow-400">{count}</div>
                          <div className="text-xs text-gray-400 capitalize">{type} Pass</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Games Usage */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">🎯 Games Usage</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{partyStats.passes.totalGamesAllowed}</div>
                        <div className="text-xs text-gray-400">Games Allowed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{partyStats.passes.totalGamesPlayed}</div>
                        <div className="text-xs text-gray-400">Games Played</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">{partyStats.passes.totalGamesRemaining}</div>
                        <div className="text-xs text-gray-400">Games Remaining</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                          style={{
                            width: `${partyStats.passes.totalGamesAllowed > 0
                              ? (partyStats.passes.totalGamesPlayed / partyStats.passes.totalGamesAllowed) * 100
                              : 0}%`
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {partyStats.passes.totalGamesAllowed > 0
                          ? Math.round((partyStats.passes.totalGamesPlayed / partyStats.passes.totalGamesAllowed) * 100)
                          : 0}% games used
                      </div>
                    </div>
                  </div>

                  {/* Pass List Table */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">📋 Pass Details</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 border-b border-gray-700">
                            <th className="text-left py-2 px-2">Code</th>
                            <th className="text-left py-2 px-2">Type</th>
                            <th className="text-center py-2 px-2">Games</th>
                            <th className="text-center py-2 px-2">Players</th>
                            <th className="text-center py-2 px-2">Status</th>
                            <th className="text-left py-2 px-2">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partyStats.passList.map((pass) => (
                            <tr key={pass.party_code} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                              <td className="py-2 px-2 font-mono text-yellow-400">{pass.party_code}</td>
                              <td className="py-2 px-2 capitalize">{pass.pass_type}</td>
                              <td className="py-2 px-2 text-center">
                                <span className="text-green-400">{pass.games_played}</span>
                                <span className="text-gray-500"> / </span>
                                <span className="text-gray-300">{pass.games_allowed}</span>
                              </td>
                              <td className="py-2 px-2 text-center text-purple-400">{pass.total_players}</td>
                              <td className="py-2 px-2 text-center">
                                {pass.is_expired ? (
                                  <span className="text-red-400 text-xs">Expired</span>
                                ) : pass.games_remaining === 0 ? (
                                  <span className="text-orange-400 text-xs">Used Up</span>
                                ) : (
                                  <span className="text-green-400 text-xs">Active</span>
                                )}
                              </td>
                              <td className="py-2 px-2 text-gray-400 text-xs">
                                {new Date(pass.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={fetchPartyStats}
                    className="w-full bg-orange-700 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors"
                  >
                    🔄 Refresh Stats
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No stats available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
