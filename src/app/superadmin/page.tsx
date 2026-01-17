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
          <div className="flex items-center gap-4">
            <a
              href="/admin-test"
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              + Generate Test Oracle
            </a>
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
    </div>
  );
}
