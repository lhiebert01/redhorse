'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VIPPass, VIPPassUsage, getVIPUsage, formatVIPExpiry } from '@/types/vip';

type FocusMode = 'wealth' | 'power' | 'love' | 'shield';

const MODE_EMOJIS: Record<FocusMode, string> = {
  wealth: '🎲',
  power: '⚔️',
  love: '❤️',
  shield: '🛡️',
};

const MODE_LABELS: Record<FocusMode, string> = {
  wealth: 'Wealth',
  power: 'Power',
  love: 'Love',
  shield: 'Shield',
};

export default function VIPPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [pass, setPass] = useState<VIPPass | null>(null);
  const [usage, setUsage] = useState<VIPPassUsage | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  // Oracle generation state
  const [showOracleForm, setShowOracleForm] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [focusMode, setFocusMode] = useState<FocusMode>('wealth');
  const [generating, setGenerating] = useState(false);

  // Check for stored VIP code on mount
  useEffect(() => {
    const storedCode = sessionStorage.getItem('vip_code');
    if (storedCode) {
      setCode(storedCode);
      validateCode(storedCode);
    }
  }, []);

  const validateCode = async (codeToValidate: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/vip/validate?code=${encodeURIComponent(codeToValidate)}`);
      const data = await response.json();

      if (data.valid) {
        setPass(data.pass);
        setUsage(data.usage);
        setValidated(true);
        sessionStorage.setItem('vip_code', codeToValidate);
      } else {
        setError(data.error || 'Invalid VIP code');
        setPass(null);
        setUsage(null);
        setValidated(false);
      }
    } catch (err) {
      setError('Failed to validate code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      validateCode(code.trim());
    }
  };

  const handleUseOracle = async () => {
    if (!birthDate || !pass) return;

    setGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/vip/use-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: pass.code,
          birthDate,
          focusMode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(data.redirect);
      } else {
        setError(data.error || 'Failed to generate oracle');
        setGenerating(false);
      }
    } catch (err) {
      setError('Failed to generate oracle');
      setGenerating(false);
    }
  };

  const handleUseSolo = async () => {
    if (!pass) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vip/use-solo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pass.code }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(data.redirect);
      } else {
        setError(data.error || 'Failed to create solo game');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create solo game');
      setLoading(false);
    }
  };

  const handleUseHosted = async () => {
    if (!pass) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vip/use-hosted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pass.code }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(data.redirect);
      } else {
        setError(data.error || 'Failed to create hosted game');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create hosted game');
      setLoading(false);
    }
  };

  const clearCode = () => {
    setCode('');
    setPass(null);
    setUsage(null);
    setValidated(false);
    setError('');
    sessionStorage.removeItem('vip_code');
  };

  // VIP Code Entry Screen
  if (!validated) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🎫</div>
            <h1 className="text-3xl font-bold text-fire-gold mb-2">VIP Access</h1>
            <p className="text-gray-400">Enter your VIP code to access exclusive features</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter VIP Code"
                className="w-full px-4 py-4 text-xl text-center bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-fire-gold focus:outline-none uppercase tracking-widest"
                maxLength={20}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-4 bg-gradient-to-r from-fire-gold to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Validating...' : 'ENTER VIP ROOM'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Oracle Form Screen
  if (showOracleForm) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔮</div>
            <h1 className="text-2xl font-bold text-fire-gold mb-2">Generate Your Oracle</h1>
            <p className="text-gray-400">Enter your birth date and choose your path</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date of Birth</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-fire-gold focus:outline-none text-center text-xl"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Choose Your Path</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(MODE_EMOJIS) as FocusMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFocusMode(mode)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      focusMode === mode
                        ? 'border-fire-gold bg-fire-gold/20'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{MODE_EMOJIS[mode]}</div>
                    <div className="text-sm font-medium">{MODE_LABELS[mode]}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleUseOracle}
              disabled={generating || !birthDate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating ? '🔮 Generating Oracle...' : '🔮 GENERATE MY ORACLE'}
            </button>

            <button
              onClick={() => setShowOracleForm(false)}
              className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700"
            >
              ← Back to VIP Room
            </button>
          </div>
        </div>
      </main>
    );
  }

  // VIP Room Screen (validated)
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-fire-gold mb-2">Welcome to the VIP Room</h1>
          <p className="text-gray-400">
            {pass?.recipient_name ? `Hello, ${pass.recipient_name}!` : 'You have exclusive access'}
          </p>
        </div>

        {/* Pass Info Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-fire-gold/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">VIP CODE</div>
            <div className="font-mono text-2xl text-fire-gold tracking-widest">{pass?.code}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">STATUS</div>
            <div className={`text-sm font-medium ${pass && new Date(pass.expires_at) > new Date() ? 'text-green-400' : 'text-red-400'}`}>
              {pass && formatVIPExpiry(pass)}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">ENTITLEMENTS REMAINING</div>
            <div className="text-3xl font-bold text-fire-gold">
              {usage?.remaining} / {usage?.total}
            </div>
          </div>
        </div>

        {/* Entitlements Grid */}
        <div className="space-y-4 mb-8">
          {/* Oracle */}
          <div className={`bg-gray-900 rounded-xl p-5 border-2 ${usage?.oracle.used ? 'border-gray-700 opacity-60' : 'border-purple-500/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔮</div>
                <div>
                  <div className="font-bold text-lg">AI Oracle Reading</div>
                  <div className="text-sm text-gray-400">Generate a personalized Fire Horse Oracle</div>
                  <div className="text-xs text-gray-500 mt-1">Worth $8.88</div>
                </div>
              </div>
              {usage?.oracle.used ? (
                <div className="text-green-400 text-sm font-medium">✓ Used</div>
              ) : (
                <button
                  onClick={() => setShowOracleForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all"
                >
                  USE →
                </button>
              )}
            </div>
          </div>

          {/* Solo Game */}
          <div className={`bg-gray-900 rounded-xl p-5 border-2 ${usage?.solo.used ? 'border-gray-700 opacity-60' : 'border-blue-500/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎮</div>
                <div>
                  <div className="font-bold text-lg">Solo Trivia Game</div>
                  <div className="text-sm text-gray-400">Play Fire Horse Trivia by yourself</div>
                  <div className="text-xs text-gray-500 mt-1">Worth $2.88</div>
                </div>
              </div>
              {usage?.solo.used ? (
                <div className="text-green-400 text-sm font-medium">✓ Used</div>
              ) : (
                <button
                  onClick={handleUseSolo}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 transition-all"
                >
                  {loading ? '...' : 'USE →'}
                </button>
              )}
            </div>
          </div>

          {/* Hosted Game */}
          <div className={`bg-gray-900 rounded-xl p-5 border-2 ${usage?.hosted.used ? 'border-gray-700 opacity-60' : 'border-red-500/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎉</div>
                <div>
                  <div className="font-bold text-lg">Host a Party Game</div>
                  <div className="text-sm text-gray-400">Host multiplayer trivia for up to 20 players</div>
                  <div className="text-xs text-gray-500 mt-1">Worth $8.88</div>
                </div>
              </div>
              {usage?.hosted.used ? (
                <div className="text-green-400 text-sm font-medium">✓ Used</div>
              ) : (
                <button
                  onClick={handleUseHosted}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-400 disabled:opacity-50 transition-all"
                >
                  {loading ? '...' : 'USE →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center mb-6">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="text-center space-y-4">
          <button
            onClick={clearCode}
            className="text-gray-500 hover:text-gray-300 text-sm"
          >
            Use a different VIP code
          </button>
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
