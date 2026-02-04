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
    // Party passes (multiplayer)
    partyPasses?: {
      total: number;
      byType: Record<string, number>;
      gamesAllowed: number;
      gamesPlayed: number;
      gamesRemaining: number;
    };
    partyGames?: {
      total: number;
      completed: number;
      inProgress: number;
    };
    partyPlayers?: {
      total: number;
      avgPerGame: number;
    };
    partyPassList?: Array<{
      party_code: string;
      pass_type: string;
      is_solo: boolean;
      games_allowed: number;
      games_played: number;
      games_remaining: number;
      total_players: number;
      created_at: string;
      expires_at: string;
      is_expired: boolean;
    }>;
    // Solo passes
    soloPasses?: {
      total: number;
      active: number;
      expired: number;
      gamesAllowed: number;
      gamesPlayed: number;
      gamesRemaining: number;
    };
    soloGames?: {
      total: number;
      completed: number;
      inProgress: number;
    };
    soloPassList?: Array<{
      party_code: string;
      pass_type: string;
      is_solo: boolean;
      games_allowed: number;
      games_played: number;
      games_remaining: number;
      total_players: number;
      created_at: string;
      expires_at: string;
      is_expired: boolean;
    }>;
    // Legacy fields
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
      is_solo?: boolean;
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
            <a
              href="/superadmin/vip"
              className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🎫 VIP Passes
            </a>
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
                  {/* ============ PARTY PASSES SECTION ============ */}
                  <div className="border-2 border-orange-600 rounded-xl p-4">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">🎉 Party Passes (Multiplayer)</h3>

                    {/* Party Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-400">{partyStats.partyPasses?.total || 0}</div>
                        <div className="text-xs text-gray-400">Passes</div>
                      </div>
                      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{partyStats.partyGames?.total || 0}</div>
                        <div className="text-xs text-gray-400">Games</div>
                      </div>
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{partyStats.partyGames?.completed || 0}</div>
                        <div className="text-xs text-gray-400">Completed</div>
                      </div>
                      <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{partyStats.partyPlayers?.total || 0}</div>
                        <div className="text-xs text-gray-400">Players</div>
                      </div>
                    </div>

                    {/* Party Pass Type Breakdown */}
                    <div className="bg-gray-800 rounded-lg p-3 mb-4">
                      <div className="text-sm font-bold text-white mb-2">Pass Types</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(partyStats.partyPasses?.byType || {}).map(([type, count]) => (
                          <div key={type} className="bg-gray-900 rounded px-3 py-1">
                            <span className="text-yellow-400 font-bold">{count as number}</span>
                            <span className="text-gray-400 text-xs ml-1 capitalize">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Party Games Usage Bar */}
                    <div className="bg-gray-800 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Games: {partyStats.partyPasses?.gamesPlayed || 0} played / {partyStats.partyPasses?.gamesAllowed || 0} allowed</span>
                        <span>{partyStats.partyPasses?.gamesRemaining || 0} remaining</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                          style={{
                            width: `${(partyStats.partyPasses?.gamesAllowed || 0) > 0
                              ? ((partyStats.partyPasses?.gamesPlayed || 0) / (partyStats.partyPasses?.gamesAllowed || 0)) * 100
                              : 0}%`
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Avg {partyStats.partyPlayers?.avgPerGame || 0} players/game
                      </div>
                    </div>

                    {/* Party Pass List Table */}
                    {(partyStats.partyPassList || []).length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                              <th className="text-left py-1 px-1">Code</th>
                              <th className="text-left py-1 px-1">Type</th>
                              <th className="text-center py-1 px-1">Games</th>
                              <th className="text-center py-1 px-1">Players</th>
                              <th className="text-center py-1 px-1">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(partyStats.partyPassList || []).map((pass: { party_code: string; pass_type: string; games_played: number; games_allowed: number; total_players: number; is_expired: boolean; games_remaining: number }) => (
                              <tr key={pass.party_code} className="border-b border-gray-700/50">
                                <td className="py-1 px-1 font-mono text-yellow-400">{pass.party_code}</td>
                                <td className="py-1 px-1 capitalize">{pass.pass_type}</td>
                                <td className="py-1 px-1 text-center">
                                  <span className="text-green-400">{pass.games_played}</span>
                                  <span className="text-gray-500">/</span>
                                  <span className="text-gray-300">{pass.games_allowed}</span>
                                </td>
                                <td className="py-1 px-1 text-center text-purple-400">{pass.total_players}</td>
                                <td className="py-1 px-1 text-center">
                                  {pass.is_expired ? (
                                    <span className="text-red-400">Expired</span>
                                  ) : pass.games_remaining === 0 ? (
                                    <span className="text-orange-400">Used</span>
                                  ) : (
                                    <span className="text-green-400">Active</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* ============ SOLO PASSES SECTION ============ */}
                  <div className="border-2 border-purple-600 rounded-xl p-4">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">🎯 Solo Passes (Single Player)</h3>

                    {/* Solo Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{partyStats.soloPasses?.total || 0}</div>
                        <div className="text-xs text-gray-400">Passes</div>
                      </div>
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{partyStats.soloPasses?.active || 0}</div>
                        <div className="text-xs text-gray-400">Active</div>
                      </div>
                      <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-400">{partyStats.soloPasses?.expired || 0}</div>
                        <div className="text-xs text-gray-400">Expired</div>
                      </div>
                      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{partyStats.soloGames?.completed || 0}</div>
                        <div className="text-xs text-gray-400">Games Done</div>
                      </div>
                    </div>

                    {/* Solo Games Usage Bar */}
                    <div className="bg-gray-800 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Games: {partyStats.soloPasses?.gamesPlayed || 0} played / {partyStats.soloPasses?.gamesAllowed || 0} allowed</span>
                        <span>{partyStats.soloPasses?.gamesRemaining || 0} remaining</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{
                            width: `${(partyStats.soloPasses?.gamesAllowed || 0) > 0
                              ? ((partyStats.soloPasses?.gamesPlayed || 0) / (partyStats.soloPasses?.gamesAllowed || 0)) * 100
                              : 0}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Solo Pass List Table */}
                    {(partyStats.soloPassList || []).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                              <th className="text-left py-1 px-1">Code</th>
                              <th className="text-center py-1 px-1">Games</th>
                              <th className="text-center py-1 px-1">Status</th>
                              <th className="text-left py-1 px-1">Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(partyStats.soloPassList || []).map((pass: { party_code: string; games_played: number; games_allowed: number; is_expired: boolean; games_remaining: number; created_at: string }) => (
                              <tr key={pass.party_code} className="border-b border-gray-700/50">
                                <td className="py-1 px-1 font-mono text-purple-400">{pass.party_code}</td>
                                <td className="py-1 px-1 text-center">
                                  <span className="text-green-400">{pass.games_played}</span>
                                  <span className="text-gray-500">/</span>
                                  <span className="text-gray-300">{pass.games_allowed}</span>
                                </td>
                                <td className="py-1 px-1 text-center">
                                  {pass.is_expired ? (
                                    <span className="text-red-400">Expired</span>
                                  ) : pass.games_remaining === 0 ? (
                                    <span className="text-orange-400">Used</span>
                                  ) : (
                                    <span className="text-green-400">Active</span>
                                  )}
                                </td>
                                <td className="py-1 px-1 text-gray-400">
                                  {new Date(pass.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">No solo passes yet</div>
                    )}
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
