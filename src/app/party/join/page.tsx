'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getZodiacFromYear, MAX_PLAYERS } from '@/types/party';

// Separate component that uses useSearchParams
function JoinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCode = searchParams.get('code') || '';

  const [partyCode, setPartyCode] = useState(initialCode);
  const [nickname, setNickname] = useState('');
  const [birthMonth, setBirthMonth] = useState<number | ''>('');
  const [birthDay, setBirthDay] = useState<number | ''>('');
  const [birthYear, setBirthYear] = useState<number | ''>('');
  const [zodiac, setZodiac] = useState<{ sign: string; element: string } | null>(
    null
  );
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Month names for dropdown
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Days in selected month (accounts for leap years)
  const daysInMonth = birthMonth && birthYear
    ? new Date(Number(birthYear), Number(birthMonth), 0).getDate()
    : 31;

  // Calculate zodiac when birth date changes
  useEffect(() => {
    if (birthYear && birthYear >= 1920 && birthYear <= 2020) {
      const month = birthMonth !== '' ? Number(birthMonth) : undefined;
      const day = birthDay !== '' ? Number(birthDay) : undefined;
      const result = getZodiacFromYear(birthYear, month, day);
      setZodiac(result);
    } else {
      setZodiac(null);
    }
  }, [birthYear, birthMonth, birthDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (partyCode.length !== 6) {
      setError('Party code must be 6 characters');
      return;
    }
    if (nickname.length < 2) {
      setError('Nickname must be at least 2 characters');
      return;
    }
    if (nickname.length > 16) {
      setError('Nickname must be 16 characters or less');
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch('/api/party/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_code: partyCode.toUpperCase(),
          nickname: nickname.trim(),
          birth_year: birthYear || null,
          birth_month: birthMonth || null,
          birth_day: birthDay || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join party');
      }

      // Store player info in session storage
      sessionStorage.setItem(
        'party_player',
        JSON.stringify({
          player_id: data.player_id,
          nickname: nickname.trim(),
          zodiac_sign: zodiac?.sign,
          zodiac_element: zodiac?.element,
          party_code: partyCode.toUpperCase(),
          game_id: data.game_id,
        })
      );

      // Redirect to play page
      router.push(`/party/play/${partyCode.toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join party');
      setIsJoining(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 5; year >= 1920; year--) {
    yearOptions.push(year);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Party Code */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Party Code
        </label>
        <input
          type="text"
          value={partyCode}
          onChange={(e) =>
            setPartyCode(e.target.value.toUpperCase().slice(0, 6))
          }
          placeholder="FIRE88"
          className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-xl text-center text-2xl font-mono tracking-widest focus:border-blue-400 focus:outline-none"
          maxLength={6}
          required
        />
      </div>

      {/* Nickname */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Your Nickname
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 16))}
          placeholder="FireDragon88"
          className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-xl text-xl focus:border-blue-400 focus:outline-none"
          maxLength={16}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {nickname.length}/16 characters
        </p>
      </div>

      {/* Birthday (Optional) */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Birthday{' '}
          <span className="text-gray-600">(optional, for zodiac display)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-2 py-3 bg-black border-2 border-gray-600 rounded-xl text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="">Month</option>
            {monthNames.map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-2 py-3 bg-black border-2 border-gray-600 rounded-xl text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="">Day</option>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-2 py-3 bg-black border-2 border-gray-600 rounded-xl text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="">Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Month &amp; day ensure accurate zodiac for Jan/Feb birthdays
        </p>

        {/* Zodiac Preview */}
        {zodiac && (
          <div className="mt-3 p-3 bg-gradient-to-r from-red-900/30 to-yellow-900/30 rounded-xl border border-yellow-600/30">
            <div className="text-sm text-gray-400">Your Zodiac Sign:</div>
            <div className="text-xl font-bold">
              {zodiac.element} {zodiac.sign}{' '}
              {zodiac.element === 'Fire' && zodiac.sign === 'Horse' && '🔥🐴'}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-600 rounded-xl text-red-200 text-center">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isJoining || partyCode.length !== 6 || nickname.length < 2}
        className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
          isJoining || partyCode.length !== 6 || nickname.length < 2
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg hover:shadow-blue-500/30'
        }`}
      >
        {isJoining ? 'Joining...' : 'JOIN PARTY →'}
      </button>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href="/party"
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back to Party Home
        </Link>
      </div>
    </form>
  );
}

// Loading fallback
function JoinFormFallback() {
  return (
    <div className="space-y-6">
      <div className="h-20 bg-gray-800 animate-pulse rounded-xl" />
      <div className="h-16 bg-gray-800 animate-pulse rounded-xl" />
      <div className="h-16 bg-gray-800 animate-pulse rounded-xl" />
      <div className="h-14 bg-gray-800 animate-pulse rounded-xl" />
    </div>
  );
}

export default function JoinPartyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: 'url(/assets/Fire-Horse-2026-Chart-v2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">🎮</span>
          <h1 className="text-3xl font-bold mt-2">Join Party</h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter the party code to join the game
          </p>
        </div>

        {/* Join Form */}
        <div className="bg-gradient-to-b from-blue-900/30 to-black border-2 border-blue-500 rounded-2xl p-6">
          <Suspense fallback={<JoinFormFallback />}>
            <JoinForm />
          </Suspense>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            📱 Free to play • No account needed • Up to {MAX_PLAYERS} players
          </p>
        </div>
      </div>
    </main>
  );
}
